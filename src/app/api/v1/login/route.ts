'use server';

import { ApiResponse } from "@/lib/response";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { client } from "@/lib/supabase/client";
import { sha256 } from "@/lib/sha256";

import Session from "@/interface/session";
import User from "@/interface/user";

export async function POST(req: Request): Promise<Response> {
    const cookieStore = await cookies();

    const data = await req.json(); // { name, password }
    const name: string = data.name;
    const password: string = await sha256(data.password);

    const userExist: User | undefined = await (async () => {
        const { data, error } = await client
            .from('accounts')
            .select('*')
            .eq('name', name)
            .eq('password', password)
            .single();
        
        if (error) {
            return undefined;
        }

        return data;
    })();

    if (userExist) {
        const sessionExist: string | undefined = await (async (user: User) => {
            const userId: string = user.user_id;

            const { data, error } = await client
                .from('sessions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) return undefined;

            return data.session_token;
        })(userExist);

        if (sessionExist) {
            cookieStore.set('session', sessionExist);

            return await ApiResponse(
                true,
                'Success to login',
                {
                    token: sessionExist
                }
            );
        }

        const sessionSuccess: false | string = await (async (user: User) => {
            const session: Session = {
                session_token: randomUUID().toString(),
                user_id: user.user_id
            };

            const { error } = await client
                .from('sessions')
                .insert(session);
            
            if (error) {
                return false;
            }

            return session.session_token;
        })(userExist);

        if (sessionSuccess) {
            cookieStore.set('session', sessionSuccess);

            return await ApiResponse(
                true,
                'Success to login',
                {
                    token: sessionSuccess
                }
            );
        }
    }

    return await ApiResponse(
        false,
        'Incorrect username or password'
    );
}