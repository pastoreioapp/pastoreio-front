export interface UserLogin {
    login: string;
    password: string;
    loginType?: "email" | "phone";
}

export interface AuthResponse {
    access_token: string
}

export interface LoggedUserResponse {
    id: number,
    nome: string,
    sobrenome: string,
    login: string,
    email: string,
    telefone: string,
    perfis: Array<string>,
    isUsuarioExterno: boolean
}

export enum Perfil {
    ADMINISTRADOR_SISTEMA = "ADMINISTRADOR_SISTEMA",
    ADMINISTRADOR_IGREJA = "ADMINISTRADOR_IGREJA",
    LIDER_CELULA = "LIDER_CELULA",
    MEMBRO = "MEMBRO"
}

export const CELULA_ROLES = [Perfil.ADMINISTRADOR_SISTEMA, Perfil.ADMINISTRADOR_IGREJA, Perfil.LIDER_CELULA];