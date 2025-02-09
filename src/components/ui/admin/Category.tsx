'use client';

import { ReactElement } from "react";

import roleLevel from "@/data/roleLevel";
import Role from "@/types/role";

interface Props {
    needRole: Role;
    userRole: Role;
    title: string;
    children?: any;
}

export default function Category({ needRole, userRole, title, children }: Props): ReactElement {

    if (roleLevel[needRole] > roleLevel[userRole]) {
        return (<></>);
    }
    return (
        <div className="text-center mt-2">

            <div className="text-2xl text-center">
                { title }
            </div>

            <div className="mt-3 px-4">
                { children }
            </div>
            
        </div>
    );
}