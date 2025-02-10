'use client';

import { toast } from "sonner";

import ApiResponse from "@/interface/response";

export default async function sendMessage(threadId: string, name: string, text: string | undefined) {
    if (text && text.length >= 2) {
        const response: Response = await fetch('/api/v1/thread', {
            method: 'PUT',
            body: JSON.stringify({ thread_id: threadId, name, text }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: ApiResponse = await response.json();

        window.localStorage.setItem('handleName', name);
    
        if (data.success) {
            alert('送信に成功しました');
            window.location.reload();
        } else {
            toast.error('送信に失敗しました');
        }
    } else {
        toast.error('2文字以上は入力してください');
    }
}