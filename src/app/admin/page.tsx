'use client';

import { ReactElement, useState, useEffect } from "react";

import ApiResponse from "@/interface/response";
import roleLevel from "@/data/roleLevel";
import Header from "@/components/ui/Header";
import Option from "@/components/ui/admin/Option";
import Role from "@/types/role";
import User from "@/interface/user";

export default function Admin(): ReactElement {
    const [userRole, setUserRole] = useState<Role>('operator');

    useEffect(() => {
        const checkUserRole = async () => {
            const response: Response = await fetch('/api/v1/user');
            const data: ApiResponse = await response.json();
            console.log(data);

            if (data.success) {
                const user: User = data.body;
                const userRoleLevel: number = roleLevel[user.role];
                const needRoleLevel: number = roleLevel.deleter;
                console.log(userRoleLevel);
                console.log(needRoleLevel);

                if (userRoleLevel < needRoleLevel) {
                    alert('アクセス権限がありません');
                    // window.location.href = '/';
                    return;
                }

                setUserRole(user.role);
            } else {
                alert('権限のロードに失敗しました');
                // window.location.href = '/';
            }
        };

        checkUserRole();
    }, []);

    return (
        <>
            <Header disbleNotLoginUser={true} />

            <div className="mt-5 flex">
                <div className="w-1/5 ml-3 px-5 py-5 rounded-md bg-white shadow-md h-[75vh]">
                    <Option href="/admin/members" needRole="admin" userRole={userRole}>
                        Member
                    </Option>
                </div>

                <div className="w-full ml-3 mr-3 px-5 py-4 bg-white shadow-md rounded">
                    <div className="text-center text-3xl">
                        管理ボード
                    </div>

                    <div className="mt-3 ml-5">
                        管理ボードへようこそ <br />
                        ここから権限に対応する操作を行ってください <br />
                        <div className="flex">
                            貴方の役職は
                            <div className="text-blue-500 hover:text-blue-600 hover:underline">
                                {userRole}
                            </div>
                            です。
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
