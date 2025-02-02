'use server';

import { ApiResponse } from "@/lib/response";
import { randomUUID } from "crypto";
import { getUserFromName } from "@/lib/supabase/user/getUser";
import { client } from "@/lib/supabase/client";
import { sha256 } from "@/lib/sha256";

import User from "@/interface/user";
import Role from "@/types/role";

export async function POST(req: Request): Promise<Response> {
    const user: User = await req.json(); // { name, password }

    const name = user.user_id;
    const password: string = await sha256(
        (user.password ? (
            user.password.length >= 4 ? user.password : undefined) : undefined
        ) ?? 
        randomUUID().toString()
    );

    const role: Role = 'user';
    
    const userExists: User | undefined = await getUserFromName(name);

    if (!userExists) {
        const { error } = await client
            .from('accounts')
            .insert({
                name,
                role,
                password
            });

        if (!error) {
            return await ApiResponse(
                true,
                'Success to create user'
            );
        }
    }
    

    return await ApiResponse(
        false,
        'Failed to regist user'
    );
}