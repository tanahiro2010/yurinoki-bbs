'use server';

import { getUserFromUserId } from "@/lib/supabase/user/getUser";
import { ApiResponse } from "@/lib/response";
import { getComments } from "@/lib/supabase/thread/getComments";
import { randomUUID } from "crypto";
import { getThread } from "@/lib/supabase/thread/getThread";
import { client } from "@/lib/supabase/client";
import { Auth } from "@/lib/auth";

import Comment from "@/interface/comment";
import Session from "@/interface/session";
import Thread from "@/interface/thread";
import User from "@/interface/user";

export async function GET(req: Request): Promise<Response> {    // Threadを取得 完成
    const { searchParams } = new URL(req.url);
    const type: string = searchParams.get('type') ?? 'thread';
    const target: string = searchParams.get('filter') ?? '*';   // * 全て myself ユーザーのだけ othor ID指定

    if (type == 'thread') {
        switch (target) {
            case '*': // すべて取得
                const { data, error } = await client
                    .from('threads')
                    .select('*');
    
                if (error) return await ApiResponse(false, 'Failed to get threads', { error: error.message });
                return await ApiResponse(true, 'Success to get threads', data.sort((a, b) => b.update_date - a.update_date));
                break;
    
            case 'myself': // 自身の作成したものだけ取得
                const authResult: Session | false = await Auth();
    
                if (authResult) {
                    const userId: string = authResult.user_id;
    
                    const { data, error } = await client
                        .from('threads')
                        .select('*')
                        .eq('author_id', userId);
    
                    if (error) return await ApiResponse(false, 'Failed to get threads', { error: error.message });
                    return await ApiResponse(true, 'Success to get threads', data.sort((a, b) => b.update_date - a.update_date));
                }
    
                return await ApiResponse(
                    false,
                    'You not logged in'
                );
                break;
    
            default:
                if (target) {
                    const { data, error } = await client
                        .from('threads')
                        .select('*')
                        .eq('thread_id', target)
                        .single();
    
                    if (error) return await ApiResponse(
                        false,
                        'Internal Server Error',
                        { message: error.message }
                    );
    
                    return await ApiResponse(
                        true,
                        'Success to get thread data',
                        data
                    );
                }
    
                return await ApiResponse(
                    false,
                    'Failed to get thread data'
                );
                break;
    
        }
    } else if (type == 'comment') {
        const { data, error } = await client
            .from('comments')
            .select('*')
            .eq('thread_id', target);

        if (!error) return await ApiResponse(
            true,
            'Success to get comment',
            data
        );
    }
    

    return await ApiResponse(
        false,
        'Internal Server Error'
    );
}

export async function POST(req: Request): Promise<Response> {   // Threadを作成 完成
    const authResult: false | Session = await Auth();
    console.log(`Auth: ${JSON.stringify(authResult)}`);

    if (authResult) {
        const author: User | undefined = await getUserFromUserId(authResult.user_id);
        console.log(`Autor: ${JSON.stringify(author)}`);

        if (author) {
            const data = await req.json();
            const name: string | undefined = data.name;

            if (name) {
                const threadId: string = randomUUID().toString();
                const thread: Thread = {
                    thread_id: threadId,
                    author_id: authResult.user_id,

                    name: name,

                    update_date: Date.now()
                };

                const { error } = await client
                    .from('threads')
                    .insert(thread);

                console.log(error);
                
                if (!error) return await ApiResponse(
                    true,
                    'Success to create thread.',
                    {
                        thread_id: threadId
                    }
                );
            }
        }
    }
    
    return await ApiResponse(
        false,
        'Failed to create thread.'
    );
}

export async function PUT(req: Request): Promise<Response> {    // Threadにコメント投稿 完成
    const authResult: Session | false = await Auth();

    if (authResult) {
        const data = await req.json();
        const keys: string[] = Object.keys(data);

        if (keys.includes('thread_id') && keys.includes('text')) {
            const threadId: string = data.thread_id;
            const thread: Thread | undefined = await getThread(threadId);

            if (thread) {
                const comments: Comment[] | undefined = await getComments(threadId);
                
                if (comments) {
                    const comment: Comment = {
                        thread_id: threadId,
                        comment_no: comments.length + 1,
                        author_id: authResult.user_id,

                        name: data.name ?? '風吹けば名無し',
                        text: data.text
                    }
                    const { error } = await client
                        .from('comments')
                        .insert( comment );

                    if (!error) {
                        return await ApiResponse(
                            true,
                            'Success to send message'
                        );
                    }
                }
                
            }
        }
    }
    
    return await ApiResponse(
        false,
        'Failed to send comment.'
    );
}

export async function DELETE(req: Request): Promise<Response> { // Threadかコメント削除
    const data = await req.json();
    const authResult: Session | false = await Auth();

    if (data.type == 'thread') {
        if (Object.keys(data).includes('thread_id')) {
            const threadId: string = data.thread_id;
        }
    } else if (data.type == 'comment') {
        
    }

    return await ApiResponse(
        false,
        'Failed to get comments'
    );
}