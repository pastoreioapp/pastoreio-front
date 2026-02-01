import axios from "axios";
import type { Encontro } from "../domain/encontro";

const api = axios.create({
  baseURL: "/mocks",
});

export class EncontroRepository {
  async findAll(): Promise<Encontro[]> {
    const response = await api.get<Encontro[]>("/encontros.json");
    return response.data;
  }
}
