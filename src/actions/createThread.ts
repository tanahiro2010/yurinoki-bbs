'use client';

import ApiResponse from "@/interface/response";

export default async function CreateThreadAction() {
    const threadName: string | null = prompt('作成するスレッド名を入力してください');
    console.log(threadName);

    if (!threadName) {
        alert('作成するスレッドの名前をちゃんと入力してください');
        return;
    }

    const response: Response = await fetch('/api/v1/thread', {
        method: 'POST',
        body: JSON.stringify({ name: threadName }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data: ApiResponse = await response.json();
    console.log(data);

    if (data.success) {
        alert('作成に成功しました');
        window.location.href = `/thread/${data.body.thread_id}`;
    } else {
        alert('処理に失敗しました');
    }

    return;
}