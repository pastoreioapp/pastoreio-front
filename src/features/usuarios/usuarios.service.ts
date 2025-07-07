import axios from "axios";
import { Usuario } from "./types";

export const api = axios.create({
    baseURL: "/mocks",
});

export async function getUsuarioLogado(): Promise<Usuario> {
    const response = await api.get<Usuario[]>("/usuario-logado.json");
    return response.data[1];
}
