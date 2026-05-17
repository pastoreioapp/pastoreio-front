import { StatusMultiplicacao } from "../domain/status-multiplicacao";
import type { MultiplicacaoRepository } from "../infra/multiplicacao.repository";
import type { CreateMultiplicacaoDto, MultiplicacaoListItemDto } from "./dtos";

export class MultiplicacaoService {
  constructor(private repo: MultiplicacaoRepository) {}

  async list(celulaOrigemId: number): Promise<MultiplicacaoListItemDto[]> {
    if (!Number.isFinite(celulaOrigemId)) {
      throw new Error("Celula de origem invalida.");
    }

    return this.repo.listByCelulaOrigemId(celulaOrigemId);
  }

  async create(
    dto: CreateMultiplicacaoDto,
    auditUserId: string,
  ): Promise<{ id: number; celulaDestinoId: number | null }> {
    if (!Number.isFinite(dto.celulaOrigemId)) {
      throw new Error("Celula de origem invalida.");
    }

    if (!dto.nomeCelulaDestino.trim()) {
      throw new Error("Informe o nome da nova celula.");
    }

    if (dto.membros.length === 0) {
      throw new Error("Selecione pelo menos um membro para multiplicar.");
    }

    const membroIds = dto.membros.map((membro) => membro.membroId);
    if (!Number.isFinite(dto.liderMembroId)) {
      throw new Error("Informe o lider da nova celula.");
    }

    if (!membroIds.includes(dto.liderMembroId)) {
      throw new Error("O lider da nova celula deve estar entre os membros selecionados.");
    }

    const uniqueMembroIds = new Set(membroIds);
    if (uniqueMembroIds.size !== membroIds.length) {
      throw new Error("Existem membros duplicados na multiplicacao.");
    }

    const now = new Date().toISOString();
    const celulaDestinoId = await this.repo.createCelula({
      nome: dto.nomeCelulaDestino.trim(),
      ativa: true,
      deletado: false,
      criado_em: now,
      criado_por: auditUserId,
    });

    const multiplicacaoId = await this.repo.createMultiplicacao({
      celula_origem_id: dto.celulaOrigemId,
      celula_destino_id: celulaDestinoId,
      lider_membro_id: dto.liderMembroId,
      data_multiplicacao: dto.dataMultiplicacao || null,
      status_multiplicacao: StatusMultiplicacao.PLANEJADA,
      observacoes: buildObservacoes(dto.nomeCelulaDestino, dto.observacoes),
      deletado: false,
      criado_em: now,
      criado_por: auditUserId,
    });

    await this.repo.createMultiplicacaoMembros(
      dto.membros.map((membro) => ({
        multiplicacao_id: multiplicacaoId,
        membro_id: membro.membroId,
        papel_celula: membro.papelCelula ?? null,
        lider_nova_celula: membro.membroId === dto.liderMembroId,
        observacoes: membro.observacoes?.trim() || null,
        deletado: false,
        criado_em: now,
        criado_por: auditUserId,
      })),
    );

    return { id: multiplicacaoId, celulaDestinoId };
  }

  async delete(
    multiplicacaoId: number,
    celulaOrigemId: number,
    auditUserId: string,
  ): Promise<void> {
    if (!Number.isFinite(multiplicacaoId)) {
      throw new Error("Multiplicacao invalida.");
    }

    if (!Number.isFinite(celulaOrigemId)) {
      throw new Error("Celula de origem invalida.");
    }

    const multiplicacao = await this.repo.findDestinoByIdAndCelulaOrigemId(
      multiplicacaoId,
      celulaOrigemId,
    );

    if (!multiplicacao) {
      throw new Error("Multiplicacao nao encontrada para esta celula.");
    }

    await this.repo.softDeleteMultiplicacaoMembros(multiplicacaoId, auditUserId);
    await this.repo.softDeleteMultiplicacao(
      multiplicacaoId,
      celulaOrigemId,
      auditUserId,
    );

    if (multiplicacao.celulaDestinoId != null) {
      await this.repo.softDeleteCelula(multiplicacao.celulaDestinoId, auditUserId);
    }
  }
}

function buildObservacoes(
  nomeCelulaDestino: string,
  observacoes?: string | null,
): string {
  const detalhes = observacoes?.trim();
  const nome = nomeCelulaDestino.trim();

  if (!detalhes) {
    return `Nova celula planejada: ${nome}`;
  }

  return `Nova celula planejada: ${nome}\n\n${detalhes}`;
}
