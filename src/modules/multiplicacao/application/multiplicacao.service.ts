import { StatusMultiplicacao } from "../domain/status-multiplicacao";
import type { MultiplicacaoRepository } from "../infra/multiplicacao.repository";
import type {
  CreateMultiplicacaoDto,
  MultiplicacaoListItemDto,
  UpdateMultiplicacaoDto,
} from "./dtos";

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
    validateMultiplicacaoDto(dto);

    const now = new Date().toISOString();
    const multiplicacaoId = await this.repo.createMultiplicacao({
      celula_origem_id: dto.celulaOrigemId,
      celula_destino_id: null,
      nome_celula_destino: dto.nomeCelulaDestino.trim(),
      lider_membro_id: dto.liderMembroId,
      data_multiplicacao: dto.dataMultiplicacao || null,
      status_multiplicacao: StatusMultiplicacao.EM_PLANEJAMENTO,
      observacoes: dto.observacoes?.trim() || null,
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

    return { id: multiplicacaoId, celulaDestinoId: null };
  }

  async update(dto: UpdateMultiplicacaoDto, auditUserId: string): Promise<void> {
    if (!Number.isFinite(dto.id)) {
      throw new Error("Multiplicacao invalida.");
    }

    validateMultiplicacaoDto(dto);

    const multiplicacao = await this.repo.findDestinoByIdAndCelulaOrigemId(
      dto.id,
      dto.celulaOrigemId,
    );

    if (!multiplicacao) {
      throw new Error("Multiplicacao nao encontrada para esta celula.");
    }

    if (multiplicacao.statusMultiplicacao !== StatusMultiplicacao.EM_PLANEJAMENTO) {
      throw new Error("Somente multiplicacoes em planejamento podem ser editadas.");
    }

    const now = new Date().toISOString();
    await this.repo.updateMultiplicacao(dto.id, dto.celulaOrigemId, {
      nome_celula_destino: dto.nomeCelulaDestino.trim(),
      lider_membro_id: dto.liderMembroId,
      data_multiplicacao: dto.dataMultiplicacao || null,
      observacoes: dto.observacoes?.trim() || null,
      atualizado_em: now,
      atualizado_por: auditUserId,
    });

    await this.repo.replaceMultiplicacaoMembros(
      dto.id,
      dto.membros.map((membro) => ({
        multiplicacao_id: dto.id,
        membro_id: membro.membroId,
        papel_celula: membro.papelCelula ?? null,
        lider_nova_celula: membro.membroId === dto.liderMembroId,
        observacoes: membro.observacoes?.trim() || null,
        deletado: false,
        criado_em: now,
        criado_por: auditUserId,
      })),
      auditUserId,
    );
  }

  async solicitarAnalise(
    multiplicacaoId: number,
    celulaOrigemId: number,
    auditUserId: string,
  ): Promise<void> {
    const multiplicacao = await this.getMultiplicacaoForStatusChange(
      multiplicacaoId,
      celulaOrigemId,
    );

    if (multiplicacao.statusMultiplicacao !== StatusMultiplicacao.EM_PLANEJAMENTO) {
      throw new Error("Somente multiplicacoes em planejamento podem ser enviadas para analise.");
    }

    await this.repo.updateStatus(multiplicacaoId, celulaOrigemId, {
      status_multiplicacao: StatusMultiplicacao.EM_ANALISE,
      atualizado_em: new Date().toISOString(),
      atualizado_por: auditUserId,
    });
  }

  async finalizar(
    multiplicacaoId: number,
    celulaOrigemId: number,
    auditUserId: string,
  ): Promise<void> {
    const multiplicacao = await this.getMultiplicacaoForStatusChange(
      multiplicacaoId,
      celulaOrigemId,
    );

    if (multiplicacao.statusMultiplicacao !== StatusMultiplicacao.AUTORIZADA) {
      throw new Error("Somente multiplicacoes autorizadas podem ser finalizadas.");
    }

    const now = new Date().toISOString();
    const celulaDestinoId =
      multiplicacao.celulaDestinoId ??
      (await this.repo.createCelula({
        nome: multiplicacao.nomeCelulaDestino?.trim() || "Nova celula",
        ativa: true,
        deletado: false,
        criado_em: now,
        criado_por: auditUserId,
      }));

    await this.repo.updateStatus(multiplicacaoId, celulaOrigemId, {
      celula_destino_id: celulaDestinoId,
      status_multiplicacao: StatusMultiplicacao.FINALIZADA,
      atualizado_em: now,
      atualizado_por: auditUserId,
    });
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

  private async getMultiplicacaoForStatusChange(
    multiplicacaoId: number,
    celulaOrigemId: number,
  ) {
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

    return multiplicacao;
  }
}

function validateMultiplicacaoDto(dto: CreateMultiplicacaoDto): void {
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
}
