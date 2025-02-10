'use client';

import { toast } from "sonner";

import ApiResponse from "@/interface/response";

export default async function deleteSession(token: string) {
    const response: Response = await fetch('/api/v1/session', {
        method: 'DELETE',
        body: JSON.stringify({ token }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data: ApiResponse = await response.json();

    if (data.success) {
        window.location.reload();
    } else {
        toast.error('セッションの削除に失敗しました');
    }
}