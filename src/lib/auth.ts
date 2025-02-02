'use server';

import { cookies } from "next/headers";
import { client } from "./supabase/client";

import Session from "@/interface/session";
import User from "@/interface/user";

export async function Auth(): Promise<Session | false> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (token) {
        const { data, error } = await client
            .from('sessions')
            .select('*')
            .eq('session_token', token)
            .single();
        
        if (!error && data) {
            return data;
        } 
    }

    return false;
}