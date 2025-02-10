'use client';

import { toast } from "sonner";

import ApiResponse from "@/interface/response";

export default async function authUser(userId: string) {
    const response: Response = await fetch('/api/v1/user', {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId, role: 'member' }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data: ApiResponse = await response.json();

    if (data.success) {
        window.location.href = '/admin/auth?success=true';
    } else {
        toast.error('ユーザーの認証に失敗しました');
    }
}