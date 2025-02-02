'use client';

import { ReactElement, Ref, useRef } from "react";

import Header from "@/components/ui/Header";
import A from "@/components/ui/A";

export default function ForgetPassword(): ReactElement {
    return (
        <>
        <Header disbleLoginUser={true} />

        <div className="flex mt-5">
            <div className="w-1/5"></div>

            <div className="w-full bg-white shadow-md px-4 py-4 flex rounded-md items-center">
                <div className="w-full px-2">
                    <div className="text-center text-3xl">
                        パスワードを忘れた場合
                    </div>

                    <div className="mt-3 bg-gray-100 rounded-md px-4 py-2">
                        パスワードを忘れた場合、管理者に自身の登録したnameと共に申告してください <br />
                        オペレーター権限、管理者権限を持つユーザーは他のユーザーのパスワードを変更できます <br />
                        <br />
                        
                        <div className="text-center">
                            <A href="/login">ログインページはこちら</A>
                        </div>

                    </div>
                    
                </div>
            </div>

            <div className="w-1/5"></div>
        </div>

        </>
    );
}