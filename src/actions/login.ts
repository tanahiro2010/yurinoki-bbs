'use client';

import ApiResponse from "@/interface/response";

export default async function LoginAction(name: string, password: string) {
    try {
        const response: Response = await fetch('/api/v1/login', {
            method: 'POST',
            body: JSON.stringify({name, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: ApiResponse = await response.json();
    
        if (data.success) {
            window.location.href = '/';
        } else {
            alert('ログインに失敗しました');
        }
    } catch (e) {
        alert('ログインに失敗しました');
        console.log(e);
    }
    
}