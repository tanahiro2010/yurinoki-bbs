'use server';

import { getUserFromName } from "@/lib/supabase/user/getUser";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { client } from "@/lib/supabase/client";
import { sha256 } from "@/lib/sha256";

import User from "@/interface/user";

export async function POST(req: Request): Promise<Response> {
    const user: any = await req.json(); // { name, password }

    const name = user.name;
    const uuid: string = randomUUID().toString();
    const password: string = await sha256(
        (user.password ? (
            user.password.length >= 4 ? user.password : undefined) : undefined
        ) ?? 
        uuid
    );
    
    const userExists: User | undefined = await getUserFromName(name);

    if (!userExists) {
        const { error } = await client
            .from('accounts')
            .insert({
                name,
                password
            });

        if (!error) {
            return NextResponse.json({ message: 'Success to regist user' },{status: 200});
        } else {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }
    

    return NextResponse.json({ error: 'User Conflict' }, { status: 409 });
}