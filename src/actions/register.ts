'use client';

import { toast } from "sonner";

export default async function RegistAction(name: string, password: string) {
    const response: Response = await fetch('/api/v1/register', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        window.location.href = '/login';
    } else {
        toast.error('登録に失敗しました' + response.status);
    }
}