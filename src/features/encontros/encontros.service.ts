import axios from "axios";
import { Encontro } from "./types";

export const api = axios.create({
    baseURL: "/mocks",
});

export async function getEncontros(): Promise<Encontro[]> {
    const response = await api.get<Encontro[]>("/encontros.json");
    return response.data;
}
