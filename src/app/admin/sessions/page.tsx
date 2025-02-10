'use client';
export const runtime = 'edge';

import { ReactElement, useState, useEffect } from "react";


import deleteSession from "@/actions/deleteSession";
import ApiResponse from "@/interface/response";
import roleLevel from "@/data/roleLevel";
import Sidebar from "@/components/ui/admin/SideBar";
import Session from "@/interface/session";
import Header from "@/components/ui/Header";
import Role from "@/types/role";
import User from "@/interface/user";

export default function SessionAdmin(): ReactElement {
    const [userRole, setUserRole] = useState<Role>('deleter');
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            const response: Response = await fetch('/api/v1/session');
            const data: ApiResponse = await response.json();

            if (data.success) {
                setSessions(data.body);
            }
        };

        const checkUserRole = async () => {
            const response: Response = await fetch('/api/v1/user');
            const data: ApiResponse = await response.json();

            if (data.success) {
                const user: User = data.body;
                const userRoleLevel: number = roleLevel[user.role];
                const needRoleLevel: number = roleLevel.admin;

                if (userRoleLevel < needRoleLevel) {
                    alert('アクセス権限がありません');
                    window.location.href = '/';
                }

                setUserRole(user.role);
                await getUsers();
            } else {
                alert('権限のロードに失敗しました');
                window.location.href = '/';
            }
        };

        checkUserRole();
    }, []);

    return (
        <>
            <Header disbleNotLoginUser={true} />

            <div className="mt-5 flex">
                <Sidebar userRole={userRole} />

                <div className="w-full ml-3 mr-3 px-5 py-4 bg-white shadow-md rounded">
                    <div className="text-center text-3xl">
                        セッション管理ボード
                    </div>

                    <div className="w-full px-3 mt-4 items-center">
                        <div className="flex">
                            <div className="w-1/2 px-2 py-2 text-center border rounded-l-md">
                                SessionToken
                            </div>

                            <div className="w-1/2 px-2 py-2 text-center border">
                                ID
                            </div>

                            <div className="w-1/4 px-2 py-2 text-center border rounded-r-md">
                                Control
                            </div>
                        </div>

                        {sessions.map((session: Session) => (
                            <div className="flex" key={session.session_token}>
                                <div className="w-1/2 px-2 py-2 border text-center flex items-center justify-center">
                                    {session.session_token}
                                </div>

                                <div className="w-1/2 px-2 py-2 border text-center flex items-center justify-center">
                                    {session.user_id}
                                </div>

                                <div className="w-1/4 px-2 py-2 text-center border items-center flex items-center justify-center">
                                    <button
                                        className="rounded-md border border-red-200 px-3 py-2 mr-2 bg-red-100 hover:bg-red-200"
                                        onClick={() => deleteSession(session.session_token)}
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}