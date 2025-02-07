'use server';

import { ApiResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { client } from "@/lib/supabase/client";


export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    let userId: string | null = searchParams.get('user');

    if (!userId) {
        const cookieStore = await cookies();
        const sessionToken: string | undefined = cookieStore.get('session')?.value;

        if (sessionToken) {
            const { data, error } = await client
                .from('sessions')
                .select('*')
                .eq('session_token', sessionToken)
                .single();

            if (!error) {
                userId = data.user_id;
            }
        }
    }

    const { data, error } = await client
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (!error && data) {
        delete data.password;
        return ApiResponse(
            true,
            'Success to get user data.',
            data
        );
    }

    return ApiResponse(
        false,
        'Failed to get user data.'
    );
}