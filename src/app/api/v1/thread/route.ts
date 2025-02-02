'use server';

import { getUserFromUserId } from "@/lib/supabase/user/getUser";
import { ApiResponse } from "@/lib/response";
import { randomUUID } from "crypto";
import { client } from "@/lib/supabase/client";
import { Auth } from "@/lib/auth";

import Comment from "@/interface/comment";
import Session from "@/interface/session";
import Thread from "@/interface/thread";
import User from "@/interface/user";


export async function GET(req: Request): Promise<Response> {    // Threadを取得
    const { searchParams } = new URL(req.url);
    const target: string = searchParams.get('target') ?? '*';   // * 全て myself ユーザーのだけ othor ID指定

    switch (target) {
        case '*': // すべて取得
            const { data, error } = await client
                .from('threads')
                .select('*');

            if (error) return await ApiResponse(false, 'Failed to get threads', { error: error.message });
            return await ApiResponse(true, 'Success to get threads', data);
            break;

        case 'myself': // 自身の作成したものだけ取得

            break;

        default:

            break;

    }
}

export async function POST(req: Request): Promise<Response> {   // Threadを作成
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

export async function PUT(req: Request): Promise<Response> {    // Threadにコメント投稿
}

export async function DELETE(req: Request): Promise<Response> { // Threadかコメント削除
}