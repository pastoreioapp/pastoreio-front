import axios from "axios";
import { Usuario } from "./types";

export const api = axios.create({
    baseURL: "/mocks",
});

export async function patchUsuario(usuario: Usuario): Promise<Usuario> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Dados enviados para PATCH/me:", usuario);
            resolve(usuario);
        }, 1500);
    });
}
