import { Rol } from "../../models/rol";

export interface UserResponse {
    id: number,
    username: string,
    rol: Rol,
    activo: boolean,
    creado?: string
}

export interface UserRequest {
    username: string,
    password: string,
    rol: Rol
}
