import type { Encontro } from "../domain/encontro";
import type { EncontroRepository } from "../infra/encontro.repository";

export class EncontroService {
  constructor(private repo: EncontroRepository) {}

  async list(): Promise<Encontro[]> {
    return this.repo.findAll();
  }
}
