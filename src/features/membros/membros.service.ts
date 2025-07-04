import { Membro } from "@/types/types";
import axios from "axios";

export const api = axios.create({
    baseURL: "/mooks",
});

export async function getMembros(): Promise<Membro[]> {
    const response = await api.get<Membro[]>("/membros.json");
    return response.data;
}
