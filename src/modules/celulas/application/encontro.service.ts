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

  async deleteByIdAndCelula(
    id: string,
    celulaId: number,
    audit: { por: string }
  ): Promise<void> {
    return this.repo.deleteByIdAndCelula(id, celulaId, audit);
  }

  /**
   * Valida o id numérico e confirma que o encontro existe para a célula
   * (antes de apagar frequências ou o próprio encontro).
   */
  async assertEncontroExistsForCelula(
    encontroId: string,
    celulaId: number
  ): Promise<void> {
    const encIdNum = Number(encontroId);
    if (!Number.isFinite(encIdNum)) {
      throw new Error("ID do encontro inválido.");
    }

    const existe = await this.repo.existsByIdAndCelula(encontroId, celulaId);
    if (!existe) {
      throw new Error(
        "Encontro não encontrado ou você não tem permissão para excluí-lo."
      );
    }
  }
}
