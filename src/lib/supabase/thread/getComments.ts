'use server';

import { client } from "../client";

import Comment from "@/interface/comment";

export async function getComments(threadId: string): Promise<Comment[] | undefined> {
    const { data } = await client
        .from('comments')
        .select('*')
        .eq('thread_id', threadId);

    if (data) return data;
    return undefined;
}