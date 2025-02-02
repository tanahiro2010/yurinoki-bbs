export default interface Thread{
    id?: number;
    thread_id?: string;
    author_id: string;

    name: string;
    
    created_at?: string;
    update_date: number;
}