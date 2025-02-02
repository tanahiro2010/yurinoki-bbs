export async function sha256(text: string): Promise<string> {
    const encoder: TextEncoder = new TextEncoder();
    const dataBuffer: Uint8Array = encoder.encode(text);
    const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray: number[] = Array.from(new Uint8Array(hashBuffer));
    const hashHex: string = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}