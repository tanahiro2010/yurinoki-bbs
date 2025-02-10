'use server';

import { ApiResponse } from "@/lib/response";
import { client } from "@/lib/supabase/client";
import { Auth } from "@/lib/auth";

import Session from "@/interface/session";

export async function GET(): Promise<Response> {
    const session: Session | false = await Auth();
    console.log(session);

    if (session) {
        const token = session.session_token;

        const { error } = await client
            .from('sessions')
            .delete()
            .eq('session_token', token)
            .throwOnError(); // 追加

        if (error) {
            console.error("ログアウト処理中にエラーが発生:", error);
            return ApiResponse(false, "Internal Server Error");
        }
    }

    return ApiResponse(
        true,
        'Success to logout'
    );
}
