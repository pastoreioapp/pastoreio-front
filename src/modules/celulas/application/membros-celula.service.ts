import {
  parsePapelCelula,
  PapelCelula,
} from "../domain/papel-celula";
import type { MembroDaCelulaListItemDto } from "./dtos";
import type { MembrosCelulaRepository } from "../infra/membros-celula.repository";

export class MembrosCelulaService {
  constructor(private repo: MembrosCelulaRepository) {}

  async listMembros(celulaId: number): Promise<MembroDaCelulaListItemDto[]> {
    return this.repo.findMembrosByCelulaId(celulaId);
  }

  async listTodosMembros(celulaId: number): Promise<MembroDaCelulaListItemDto[]> {
    return this.repo.findTodosMembrosAtivosByCelulaId(celulaId);
  }

  async listMembrosNaData(celulaId: number, data: string): Promise<MembroDaCelulaListItemDto[]> {
    return this.repo.findMembrosByCelulaIdNaData(celulaId, data);
  }

  async desvincular(vinculoId: number, desvinculadoPor: string): Promise<void> {
    const vinculo = await this.repo.findVinculoById(vinculoId);
    if (!vinculo) throw new Error("Vínculo não encontrado.");
    if (vinculo.dataSaida) throw new Error("Este membro já foi desvinculado desta célula.");
    await this.repo.desvincular(vinculoId, desvinculadoPor);
  }

  async listMembroIdsLideresAtivos(): Promise<number[]> {
    return this.repo.findMembroIdsLideresAtivos();
  }

  async assertNaoELiderAtivo(
    membroId: number,
    celulaIdExcecao?: number,
  ): Promise<void> {
    const jaELider = await this.repo.existeLiderancaAtiva(
      membroId,
      celulaIdExcecao,
    );
    if (jaELider) {
      throw new Error(
        "Este membro já é líder de uma célula e não pode ser adicionado a outra.",
      );
    }
  }

  async atualizarPapel(
    vinculoId: number,
    papelRaw: string,
    atualizadoPor: string,
  ): Promise<void> {
    const vinculo = await this.repo.findVinculoById(vinculoId);
    if (!vinculo) throw new Error("Vínculo não encontrado.");
    if (vinculo.dataSaida) {
      throw new Error("Este membro já foi desvinculado desta célula.");
    }

    const papel = parsePapelCelula(papelRaw) ?? PapelCelula.MEMBRO;
    if (papel === vinculo.papelCelula) return;

    if (papel === PapelCelula.LIDER_CELULA) {
      await this.assertNaoELiderAtivo(vinculo.membroId, vinculo.celulaId);
    }

    await this.repo.atualizarPapel(vinculoId, papel, atualizadoPor);
  }

  async vincularMembro(
    celulaId: number,
    membroId: number,
    papelRaw: string,
    criadoPor: string,
  ): Promise<void> {
    let papel = parsePapelCelula(papelRaw);
    if (!papel) papel = PapelCelula.MEMBRO;
    await this.assertNaoELiderAtivo(membroId);
    await this.repo.vincular(celulaId, membroId, papel, criadoPor);
  }
}
