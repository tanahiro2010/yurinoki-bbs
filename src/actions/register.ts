'use client';

import ApiResponse from "@/interface/response";

export default async function RegistAction(name: string, password: string) {
    try {
        const response: Response = await fetch('/api/v1/register', {
            method: 'POST',
            body: JSON.stringify({name, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: ApiResponse = await response.json();
    
        if (data.success) {
            window.location.href = '/login';
        } else {
            alert('登録に失敗しました');
        }
    } catch (e) {
        alert('登録に失敗しました');
        console.log(e);
    }
    
}