'use server';

import { getUserFromUserId } from "@/lib/supabase/user/getUser";
import { ApiResponse } from "@/lib/response";
import { client } from "@/lib/supabase/client";
import { Auth } from "@/lib/auth";

import roleLevel from "@/data/roleLevel";
import Session from "@/interface/session";
import User from "@/interface/user";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    let userId: string | null = searchParams.get('user');

    if (!userId) {
        const session: Session | false = await Auth();
        if (session) {
            userId = session.user_id;
        } else {
            return ApiResponse(
                false,
                'You not logged in'
            );
        }
    }

    if (userId == '*') {
        const session: Session | false = await Auth();
        if (session) {
            const user: User | undefined = await getUserFromUserId(session.user_id);
            if (user && roleLevel[user.role] >= roleLevel.operator) {
                const { data, error } = await client
                    .from('accounts')
                    .select('*');
    
                if (error) return ApiResponse(false, 'Failed to get users data', { error: error.message });
                return ApiResponse(
                    true,
                    'Success to get users data',
                    data
                );
            }
        }

        return ApiResponse(
            false,
            'Failed to get users data.',
            {
                error: 'You do not have permission.'
            }
        );
    } else {
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
}

export async function PUT(req: Request): Promise<Response> {
    const session: Session | false = await Auth();

    if (session) {
        const user: User | undefined = await getUserFromUserId(session.user_id);

        if (user && roleLevel[user.role] >= roleLevel.operator) {
            const data = await req.json();
            const userId = data.user_id;
            const updateDate: any = {};
            Object.keys(data).forEach((key: string) => {
                if (Object.keys(user).includes(key)) {
                    updateDate[key] = data[key];
                }
            });

            console.log(updateDate);

            const { error } = await client
                .from('accounts')
                .update(updateDate)
                .eq('user_id', userId);

            console.log(error);

            if (!error) return ApiResponse(
                true,
                'Success to update user'
            );
        }
    }

    return ApiResponse(
        false,
        'Failed to update user'
    );
}

export async function DELETE(req: Request): Promise<Response> {
    const session: Session | false = await Auth();

    if (session) {
        const user: User | undefined = await getUserFromUserId(session.user_id);

        if (user && user.role == "admin") {
            const data = await req.json();
            const userId: string = data.user_id;

            const deleteUserResult = await (async (): Promise<boolean> => {
                const { error } = await client
                    .from('accounts')
                    .delete()
                    .eq('user_id', userId);

                if (error) return false;
                return true;
            })();

            if (deleteUserResult) {
                const deleteThreadsResult = await (async (): Promise<boolean> => {
                    const { error } = await client
                        .from('threads')
                        .delete()
                        .eq('author_id', userId);

                    if (error) return false;
                    return true;
                })();

                if (deleteThreadsResult) {
                    const sessionDeleteResult = await (async (): Promise<boolean> => {
                        const { error } = await client
                            .from('sessions')
                            .delete()
                            .eq('user_id', userId);

                        if (error) return false;
                        return true;
                    })();

                    if (sessionDeleteResult) {
                        return ApiResponse(
                            true,
                            'Success to delete user'
                        );
                    }
                }
            }
            
        }
    }

    return ApiResponse(
        false,
        'Failed to delete user'
    );
}