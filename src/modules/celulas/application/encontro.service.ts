import type { Encontro } from "../domain/encontro";
import { EncontroRepository } from "../infra/encontro.repository";
import { FrequenciaCelulaRepository } from "../infra/frequencia-celula.repository";

export class EncontroService {
  constructor(
    private readonly repo: EncontroRepository,
    private readonly freqRepo: FrequenciaCelulaRepository
  ) {}

  async list(celulaId: number): Promise<Encontro[]> {
    return this.repo.findByCelulaId(celulaId);
  }

  async create(dados: Encontro): Promise<Encontro> {
    return this.repo.create(dados);
  }

  async update(id: string, dados: Partial<Encontro>): Promise<Encontro> {
    return this.repo.update(id, dados);
  }

  /**
   * Exclusão lógica do encontro após validar vínculo com a célula,
   * inativar frequências do encontro e marcar o encontro como deletado.
   */
  async deleteByIdAndCelula(
    id: string,
    celulaId: number,
    audit: { por: string }
  ): Promise<void> {
    await this.assertEncontroExistsForCelula(id, celulaId);
    await this.freqRepo.softDeleteByEncontroId(id, audit);
    return this.repo.deleteByIdAndCelula(id, celulaId, audit);
  }

  /**
   * Confirma que o encontro existe para a célula
   * (antes de apagar frequências ou o próprio encontro).
   */
  async assertEncontroExistsForCelula(
    encontroId: string,
    celulaId: number
  ): Promise<void> {
    const existe = await this.repo.existsByIdAndCelula(encontroId, celulaId);
    if (!existe) {
      throw new Error(
        "Encontro não encontrado ou você não tem permissão para excluí-lo."
      );
    }
  }
}
