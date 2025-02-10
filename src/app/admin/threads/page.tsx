'use client';

import { ReactElement, useState, useEffect } from "react";
import { toast } from "sonner";

import deleteThread from "@/actions/deleteThread";
import ApiResponse from "@/interface/response";
import roleLevel from "@/data/roleLevel";
import Sidebar from "@/components/ui/admin/SideBar";
import Header from "@/components/ui/Header";
import Thread from "@/interface/thread";
import Role from "@/types/role";
import User from "@/interface/user";
import { threadId } from "worker_threads";


export default function ThreadAdmin(): ReactElement {
    const [userRole, setUserRole] = useState<Role>('operator');
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        const successDialog = () => {
            const { searchParams } = new URL(window.location.href);
            const success = searchParams.get('success') ?? false;

            if (success) {
                switch (success) {
                    case 'delete':
                        toast.success('スレッドの削除に成功しました');
                        break;
                    case 'rename':
                        toast.success('スレッドの改名に成功しました');
                        break;
                }
            }

            return;
        }

        const getUsers = async () => {
            const response: Response = await fetch('/api/v1/thread');
            const data: ApiResponse = await response.json();

            if (data.success) {
                setThreads(data.body);
            } else {
                toast.error('スレッドの取得に失敗しました');
            }
        };

        const checkUserRole = async () => {
            const response: Response = await fetch('/api/v1/user');

            const data: ApiResponse = await response.json();
            console.log("API Response:", data);

            if (data.success) {
                const user: User = data.body;
                const userRoleLevel: number = roleLevel[user.role];
                const needRoleLevel: number = roleLevel.operator;

                console.log("User Role Level:", userRoleLevel);
                console.log("Required Role Level:", needRoleLevel);

                if (userRoleLevel < needRoleLevel) {
                    alert('アクセス権限がありません');
                    window.location.href = '/';
                }

                setUserRole(user.role);
                successDialog();
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
                        スレッド管理ボード
                    </div>

                    <div className="mt-3 ml-5">
                        <div className="flex">
                            <div className="w-4/5 flex">
                                <div className="w-1/4 border px-2 py-2 text-center">
                                    Title
                                </div>
                                <div className="w-2/4 border px-2 py-2 text-center">
                                    Author
                                </div>
                                <div className="w-1/4 border px-2 py-2 text-center">
                                    Created_at
                                </div>
                            </div>

                            <div className="border w-1/5 px-2 py-2 text-center">
                                Control
                            </div>
                        </div>

                        {threads.map((thread: Thread) => (
                            <div className="flex" key={thread.thread_id}>
                                <div className="w-4/5 flex">
                                    <div className="w-1/4 border px-2 py-2 text-center text-center flex items-center justify-center">
                                        { thread.name }
                                    </div>
                                    <div className="w-1/2 border px-2 py-2 text-center text-center flex items-center justify-center">
                                        { thread.author_id }
                                    </div>
                                    <div className="w-1/4 border px-2 py-2 text-center text-center flex items-center justify-center">
                                        { thread.created_at }
                                    </div>
                                </div>

                                <div className="w-1/5 border px-2 py-2 text-center text-center flex items-center justify-center">
                                    <button className="px-4 py-1 border rounded-md hover:bg-red-100" onClick={() => { deleteThread(thread.thread_id ?? "") }}>
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
