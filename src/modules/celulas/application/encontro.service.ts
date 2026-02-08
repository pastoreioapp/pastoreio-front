import type { Encontro, EncontroInsert } from "../domain/encontro";
import { EncontroRepository } from "../infra/encontro.repository";

export class EncontroService {
  constructor(private readonly repo: EncontroRepository) {}

  async list(): Promise<Encontro[]> {
    return this.repo.findAll();
  }

  async create(dados: EncontroInsert): Promise<Encontro> {
    return this.repo.create(dados);
  }
}
