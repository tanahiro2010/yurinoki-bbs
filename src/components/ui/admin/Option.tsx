'use client';

import { ReactElement, useEffect } from "react";

import roleLevel from "@/data/roleLevel";
import Link from "next/link";
import Role from "@/types/role";

interface Props {
    needRole: Role;
    userRole: Role;

    href: string;
    children?: any;
}

export default function Option({ needRole, userRole, href, children }: Props): ReactElement {
    useEffect(() => {
        const needRoleLevel: number = roleLevel[needRole];
        const userRoleLevel: number = roleLevel[userRole];

        if (userRoleLevel < needRoleLevel) {
            window.location.href = '/admin';
        }
    }, [needRole, userRole]);

    return (
        <Link href={href} className={``}>
            { children }
        </Link>
    )
}