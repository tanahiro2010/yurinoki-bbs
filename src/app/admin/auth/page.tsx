'use client';

import { ReactElement, useState, useEffect } from "react";
import { toast } from "sonner";

import ApiResponse from "@/interface/response";
import roleLevel from "@/data/roleLevel";
import authUser from "@/actions/authUser";
import Sidebar from "@/components/ui/admin/SideBar";
import Header from "@/components/ui/Header";
import Role from "@/types/role";
import User from "@/interface/user";


export default function AuthAdmin(): ReactElement {
    const [userRole, setUserRole] = useState<Role>('operator');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const successDialog = () => {
            const { searchParams } = new URL(window.location.href);
            const success = searchParams.get('success') ?? false;

            if (success == 'true') {
                toast.success('認証に成功しました');
            }
        }

        const getUsers = async () => {
            const response: Response = await fetch('/api/v1/user?user=*');
            const data: ApiResponse = await response.json();

            if (data.success) {
                const users: User[] = data.body;
                setUsers(users.filter((user: User) => user.role == "user"));
            } else {
                toast.error('ユーザーの取得に失敗しました');
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
                        ユーザー認証ボード
                    </div>

                    <div className="mt-3 ml-5">
                        <div className="flex">
                            <div className="w-4/5 flex">
                                <div className="w-1/3 border px-2 py-2 text-center">
                                    Client_ID
                                </div>
                                <div className="w-1/3 border px-2 py-2 text-center">
                                    Name
                                </div>
                                <div className="w-1/3 border px-2 py-2 text-center">
                                    Created_at
                                </div>
                            </div>

                            <div className="border w-1/5 px-2 py-2 text-center">
                                Control
                            </div>
                        </div>

                        {users.map((user: User) => (
                            <div className="flex" key={user.user_id}>
                                <div className="w-4/5 flex">
                                    <div className="w-1/3 border px-2 py-2 text-center text-center flex items-center justify-center">
                                        { user.user_id }
                                    </div>
                                    <div className="w-1/3 border px-2 py-2 text-center text-center flex items-center justify-center">
                                        { user.name }
                                    </div>
                                    <div className="w-1/3 border px-2 py-2 text-center text-center flex items-center justify-center">
                                        { user.created_at }
                                    </div>
                                </div>

                                <div className="w-1/5 border px-2 py-2 text-center text-center flex items-center justify-center">
                                    <button className="px-4 py-1 border rounded-md hover:bg-gray-100" onClick={() => { authUser(user.user_id) }}>
                                        認証
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
