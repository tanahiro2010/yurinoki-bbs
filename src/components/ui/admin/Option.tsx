'use client';

import { ReactElement } from "react";

import Link from "next/link";

interface Props {
    slug: string;
    children: string;
}

export default function Option({ slug, children }: Props): ReactElement {
    return (
        <Link href={`/admin/${slug}`} >
            <div className={`mt-2 px-2 py-2 w-full border rounded-md hover:bg-gray-100`}>
                { children }
            </div>
        </Link>
    )
}