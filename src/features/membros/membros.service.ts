import axios from "axios";
import { Membro } from "./types";

export const api = axios.create({
    baseURL: "/mocks",
});

export async function getMembros(): Promise<Membro[]> {
    const response = await api.get<Membro[]>("/membros.json");
    return response.data;
}
