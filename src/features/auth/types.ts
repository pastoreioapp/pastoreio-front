export interface UserLogin {
    login: string;
    password: string;
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