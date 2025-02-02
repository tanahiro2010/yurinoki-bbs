export default interface Session {
    id?: number;
    session_token: string;
    user_id: string;
    created_at?: string;
}