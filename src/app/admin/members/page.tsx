'use client';

import { ReactElement, useState, useEffect } from "react";
import { updateRole, updateName, deleteUser } from "@/actions/updateUser";

import ApiResponse from "@/interface/response";
import roleLevel from "@/data/roleLevel";
import Sidebar from "@/components/ui/admin/SideBar";
import Header from "@/components/ui/Header";
import Role from "@/types/role";
import User from "@/interface/user";

export default function MembersAdmin(): ReactElement {
    const [userRole, setUserRole] = useState<Role>('deleter');
    const [users, setUsers] = useState<User[]>([]);
    const [editedNames, setEditedNames] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const getUsers = async () => {
            const response: Response = await fetch('/api/v1/user?user=*');
            const data: ApiResponse = await response.json();

            if (data.success) {
                setUsers(data.body);
                // 初期値をセット
                const nameMap: { [key: string]: string } = {};
                data.body.forEach((user: User) => {
                    nameMap[user.user_id] = user.name;
                });
                setEditedNames(nameMap);
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
                        ユーザー管理ボード
                    </div>

                    <div className="w-full px-3 mt-4 items-center">
                        <div className="flex">
                            <div className="w-1/4 px-2 py-2 text-center border rounded-l-md">
                                UserId
                            </div>

                            <div className="w-1/4 px-2 py-2 text-center border">
                                Name
                            </div>

                            <div className="w-1/4 px-2 py-2 text-center border">
                                Role
                            </div>

                            <div className="w-1/4 px-2 py-2 text-center border rounded-r-md">
                                Control
                            </div>
                        </div>

                        {users.map((user: User) => (
                            <div className="flex" key={user.user_id}>
                                <div className="flex w-3/4">
                                    <div className="w-1/3 px-2 py-2 border text-center flex items-center justify-center">
                                        {user.user_id}
                                    </div>

                                    <div className="w-1/3 px-2 py-2 border flex items-center justify-center">
                                        <input
                                            type="text"
                                            value={editedNames[user.user_id] || ""}
                                            className="text-center"
                                            onChange={(e) => {
                                                setEditedNames({
                                                    ...editedNames,
                                                    [user.user_id]: e.target.value
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="w-1/3 px-2 py-2 border flex items-center justify-center">
                                        <select
                                            defaultValue={user.role}
                                            onChange={(e) => {
                                                updateRole(user.user_id, e.target.value as Role);
                                            }}
                                        >
                                            <option value="user">user</option>
                                            <option value="member">member</option>
                                            <option value="operator">operator</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="w-1/4 px-2 py-2 text-center border items-center flex items-center justify-center">
                                    <button
                                        className="rounded-md border px-3 py-2 mr-2 hover:bg-gray-100"
                                        onClick={() => updateName(user.user_id, editedNames[user.user_id])}
                                    >
                                        更新
                                    </button>
                                    <button
                                        className="rounded-md border border-red-200 px-3 py-2 mr-2 bg-red-100 hover:bg-red-200"
                                        onClick={() => deleteUser(user.user_id)}
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