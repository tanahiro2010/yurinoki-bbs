'use client';

import { toast } from "sonner";

import ApiResponse from "@/interface/response";

export default async function logout() {
    const response: Response = await fetch('/api/v1/logout');
    const data: ApiResponse = await response.json();

    if (data.success) {
        window.location.reload();
    } else {
        toast.error('ログアウトに失敗しました');
    }

    return;
}