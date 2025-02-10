'use server';

import { client } from "../client";

import Thread from "@/interface/thread";

export async function getThread(threadId: string): Promise<Thread | undefined> {
    const { data } = await client
        .from('threads')
        .select('*')
        .eq('thread_id', threadId)
        .single();

    if (data) {
        return data;
    }

    return undefined;
}