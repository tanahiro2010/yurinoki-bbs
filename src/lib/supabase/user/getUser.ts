'use server';

import { client } from "../client";
import User from "@/interface/user";

export async function getUserFromName(name?: string | null): Promise<User | undefined> {
    const { data, error } = await client
        .from('accounts')
        .select('*')
        .eq('name', name)
        .single();

    if (!error && data) {
        return data;
    }

    return undefined;
}

export async function getUserFromUserId(userId: string): Promise<User | undefined> {
    const { data, error } = await client
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (!error && data) {
        return data;
    }

    return undefined;
}