import { ReactElement } from "react";

import Link from "next/link";

interface AProps {
    href: string;
    children: string;
}

export default function A({ href, children }: AProps): ReactElement {
    return (
        <Link href={href} className={`text-blue-500 hover:text-blue-700 hover:underline`}>
            { children }
        </Link>
    );
    
}