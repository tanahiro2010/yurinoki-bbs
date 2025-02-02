'use server';

import { ApiResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { client } from "@/lib/supabase/client";

export async function GET(): Promise<Response> {
    const cookieStore = await cookies();
    const token: string | undefined = cookieStore.get('session')?.value;

    if (token) {
        const { data, error } = await client
            .from('sessions')
            .select('*')
            .eq('session_token', token)
            .single();

        if (!error) {
            return await ApiResponse(
                true,
                'You logged in',
                {
                    user_id: data.user_id
                }
            );
        }
    }

    return await ApiResponse(
        false,
        'You not logged in'
    );
}