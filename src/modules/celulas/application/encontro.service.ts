import type { Encontro } from "../domain/encontro";
import { EncontroRepository } from "../infra/encontro.repository";

export class EncontroService {
  constructor(private readonly repo: EncontroRepository) {}

  async list(celulaId: number): Promise<Encontro[]> {
    return this.repo.findByCelulaId(celulaId);
  }

  async create(dados: Encontro): Promise<Encontro> {
    return this.repo.create(dados);
  }

  async update(id: string, dados: Partial<Encontro>): Promise<Encontro> {
    return this.repo.update(id, dados);
  }

  async deleteByIdAndCelula(id: string, celulaId: number): Promise<void> {
    return this.repo.deleteByIdAndCelula(id, celulaId);
  }
}
