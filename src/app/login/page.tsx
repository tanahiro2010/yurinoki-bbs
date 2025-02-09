'use client';

import { ReactElement, Ref, useRef } from "react";

import LoginAction from "@/actions/login";
import Header from "@/components/ui/Header";
import A from "@/components/ui/A";

export default function Login(): ReactElement {
    const nameRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const passwordRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    return (
        <>
        <Header disbleLoginUser={true} />

        <div className="flex mt-5">
            <div className="w-1/5"></div>

            <div className="w-full bg-white shadow-md px-4 py-4 flex rounded-md items-center">
                <div className="w-1/2 px-2">
                    <div className="text-center text-3xl">
                        ログインポータル
                    </div>

                    <div className="mt-3 bg-gray-100 rounded-md px-2 py-2">
                        ログインポータルへようこそ <br />
                        ここからログインしてください <br />
                        まだアカウントがない人は下のリンクから登録してください <br />
                        アカウントが承認され次第、掲示板が使用できるようになります <br /><br />
                        <div className="text-center">
                            <A href="/register">アカウント登録</A> <br />
                            <A href="/login/forget_password">パスワードを忘れた場合</A>
                        </div>
                        
                    </div>
                    
                </div>

                <div className="w-1/2 px-2">
                    <div className="text-3xl text-center">
                        必要事項を入力
                    </div>

                    <form action={() => {LoginAction(nameRef.current?.value ?? '', passwordRef.current?.value ?? '')}} >
                        <div className="items-center">
                            <input 
                                type="text"
                                placeholder="name"
                                className="mt-2 px-2 py-2 border rounded w-full"
                                ref={nameRef}
                                required
                            /> <br />
                            <input 
                                type="password"
                                placeholder="password"
                                className="mt-2 px-2 py-2 border rounded w-full"
                                ref={passwordRef}
                                required
                            /> <br />

                            <div className="text-center mt-5">
                                <button className="px-4 py-2 border rounded hover:bg-gray-100">
                                    ログイン
                                </button>
                            </div>
                            
                        </div>
                    </form>
                </div>
                
            </div>

            <div className="w-1/5"></div>
        </div>

        </>
    );
}