import Role from "@/types/role";

export default interface User {
    id?:         string;
    user_id:    string;
    name:       string;
    role:       Role;
    password:   string;
    created_at?: string;
}