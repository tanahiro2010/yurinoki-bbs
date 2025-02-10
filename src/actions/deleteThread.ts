'use client';

import { toast } from "sonner";

import ApiResponse from "@/interface/response";

export default async function deleteThread(threadId: string) {
    const response: Response = await fetch('/api/v1/thread', {
        method: 'DELETE',
        body: JSON.stringify({ thread_id: threadId }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data: ApiResponse = await response.json();

    if (data.success) {
        window.location.reload();
    } else {
        toast.error('スレッドの削除に失敗しました');
    }
}