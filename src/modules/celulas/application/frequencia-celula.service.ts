import type { FrequenciaSyncLinha } from "../domain/frequencia-sync";
import { FrequenciaCelulaRepository } from "../infra/frequencia-celula.repository";

export class FrequenciaCelulaService {
  constructor(private readonly repo: FrequenciaCelulaRepository) {}

  async syncForEncontro(
    encontroId: number,
    linhas: FrequenciaSyncLinha[],
    audit: { por: string }
  ): Promise<void> {
    return this.repo.syncForEncontro(encontroId, linhas, audit);
  }
}
