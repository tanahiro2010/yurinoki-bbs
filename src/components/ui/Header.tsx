'use client';

import { ReactElement, useEffect } from "react";

import Link from "next/link";
import ApiResponse from "@/interface/response";

interface HeaderProps {
    disbleLoginUser?: boolean;    // ログインしているユーザーのアクセス拒否
    disbleNotLoginUser?: boolean; // ログインしていないユーザーのアクセス拒否
}

export default function Header({ disbleLoginUser = false, disbleNotLoginUser = false }: HeaderProps): ReactElement {
    useEffect(() => {
        const checkLogin = (async () => {
            const response: Response = await fetch('/api/v1/auth');
            const data: ApiResponse = await response.json();

            if (data.success) {
                if (disbleLoginUser) {
                    window.location.href = '/';
                }
            } else { // ログインしていないとき
                if (disbleNotLoginUser) {
                    window.location.href = '/login'
                }
            }
        });

        checkLogin();
    }, []);
    
    return (
        <>
        <div className="shadow-md mt-3 ml-3 mr-3 px-4 py-4 flex rounded-md justify-between top-0 bg-white items-center fixed left-0 right-0 z-50">
            <div className="text-2xl cursor-pointer hover:underline">
                <Link href={'/'}>
                    YurinokiBBS
                </Link>
            </div>

            <div>
                会員専用掲示板サイト
            </div>

            <div className="ml-2">
                <Link href={`/search`} className="hover:underline hover:text-blue-500">
                    検索
                </Link>
            </div>
        </div>

        <br /><br /><br /><br />
        </>
    );
}