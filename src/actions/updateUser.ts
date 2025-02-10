'use client';

import { toast } from "sonner";

import ApiResponse from "@/interface/response";
import Role from "@/types/role";

export async function updateRole(userId: string, role: Role) {
    const response: Response = await fetch('/api/v1/user', {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId, role }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data: ApiResponse = await response.json();

    if (data.success) {
        toast.success('ロールの更新に成功しました');
    } else {
        toast.error('ロールの更新に失敗しました');
    }
    
}

export async function updateName(userId: string, name: string) {
    const response: Response = await fetch('/api/v1/user', {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId, name }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data: ApiResponse = await response.json();

    if (data.success) {
        toast.success('名前の更新に成功しました');
    } else {
        toast.error('名前の更新に失敗しました');
    }
}

export async function deleteUser(userId: string) {
    if (confirm('本当に削除しますか？')) {
        const response: Response = await fetch('/api/v1/user', {
            method: 'DELETE',
            body: JSON.stringify({ user_id: userId }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: ApiResponse = await response.json();

        if (data.success) {
            window.location.reload();
        } else {
            toast.error('ユーザーの削除に失敗しました');
        }
    }
}