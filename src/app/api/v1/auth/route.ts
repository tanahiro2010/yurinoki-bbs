'use server';

import { NextResponse } from "next/server";
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
            return NextResponse.json({ success: true, message: 'You logged in', body: { user_id: data.user_id } }, { status: 200 })
            
        } else return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: 'Invalid Request' }, { status: 400 });
}