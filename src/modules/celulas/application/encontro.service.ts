import type { Encontro } from "../domain/encontro";
import { EncontroRepository } from "../infra/encontro.repository";

export class EncontroService {
  constructor(private readonly repo: EncontroRepository) {}

  async list(): Promise<Encontro[]> {
    return this.repo.findAll();
  }

  async create(dados: Encontro): Promise<Encontro> {
    return this.repo.create(dados);
  }

  async update(id: string, dados: Partial<Encontro>): Promise<Encontro> {
    return this.repo.update(id, dados);
  }
}
