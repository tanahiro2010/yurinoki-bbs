'use server';

import { getUserFromUserId } from "@/lib/supabase/user/getUser";
import { ApiResponse } from "@/lib/response";
import { client } from "@/lib/supabase/client";
import { Auth } from "@/lib/auth";

import roleLevel from "@/data/roleLevel";
import Session from "@/interface/session";
import User from "@/interface/user";

export async function GET(): Promise<Response> {
    const session: Session | false = await Auth();
    if (session) {
        const user: User | undefined = await getUserFromUserId(session.user_id);
        if (user && roleLevel[user.role] >= roleLevel.admin) {
            const { data, error } = await client
                .from('sessions')
                .select('*');

            if (error) return ApiResponse(false, 'Failed to get sessions data', { error: error.message });
            return ApiResponse(
                true,
                'Success to get sessions data',
                data
            );
        }
    }

    return ApiResponse(
        false,
        'Failed to get sessions data.',
    );
}

export async function DELETE(req: Request): Promise<Response> {
    const session: Session | false = await Auth();
    console.log(session);

    if (session) {
        const data = await req.json();
        const token = data.token ?? "";

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