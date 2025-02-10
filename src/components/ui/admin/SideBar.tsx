'use client';

import { ReactElement } from "react";

import Category from "./Category";
import Option from "./Option";
import Role from "@/types/role";

interface Props {
    userRole: Role;
};

export default function Sidebar({ userRole }: Props): ReactElement {
    return (
        <div className="w-1/5 ml-3 py-3 rounded-md bg-white shadow-md h-[75vh]">
            <Category
                needRole="admin"
                userRole={userRole}
                title="Admin" >
                <Option slug="members">
                    ユーザー管理
                </Option>

                <Option slug="sessions">
                    セッション管理
                </Option>
            </Category>

            <Category
                needRole="operator"
                userRole={userRole}
                title="Operator" >
                <Option slug="auth">
                    ユーザー認証
                </Option>

                <Option slug="threads">
                    スレッド管理
                </Option>
            </Category>
        </div>
    )
}