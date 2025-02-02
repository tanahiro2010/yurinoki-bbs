'use server';

export async function ApiResponse(success: boolean, message: string, body?: any): Promise<Response> {
    return new Response(
        JSON.stringify({
            success,
            message,
            body
        }),
        {
            headers: {
                'Content-type': 'application/json'
            },
            status: success ? 200 : 400
        }
    );
}