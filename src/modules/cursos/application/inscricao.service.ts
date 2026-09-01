import type { InscricaoRepository } from "../infra/inscricao.repository";
import type { CursoDoMembroDto, InscricaoCadastroDto } from "./dtos";
import { toCursoDoMembroDto } from "./mapper";
import { StatusTurma } from "../domain/status-turma";

export class InscricaoService {
  constructor(private readonly repo: InscricaoRepository) { }

  async listCursosDoMembro(membroId: number): Promise<CursoDoMembroDto[]> {
    const rows = await this.repo.findCursosDoMembro(membroId);
    return rows.map(toCursoDoMembroDto);
  }

  async createFromCadastro(
    membroId: number,
    cursos: InscricaoCadastroDto[],
    criadoPor: string,
  ): Promise<void> {
    const selecionados = cursos.filter(
      (curso) =>
        curso.turmaId &&
        curso.status &&
        curso.status !== StatusTurma.NAO_INICIADO,
    );

    if (selecionados.length === 0) return;

    const agora = new Date().toISOString();
    const payloads = selecionados.map((curso) => ({
      turma_id: curso.turmaId,
      participante_id: membroId,
      data_inscricao: agora,
      status: curso.status,
      data_conclusao:
        curso.status === StatusTurma.CONCLUIDO
          ? (curso.dataConclusao ?? null)
          : null,
      criado_em: agora,
      criado_por: criadoPor,
      deletado: false,
    }));

    await this.repo.insertMany(payloads);
  }

  async syncFromCadastro(
    membroId: number,
    cursos: InscricaoCadastroDto[],
    atualizadoPor: string,
  ): Promise<void> {
    const existentes = await this.listCursosDoMembro(membroId);
    const porTurma = new Map(
      existentes.map((curso) => [curso.turmaId, curso]),
    );
    const agora = new Date().toISOString();

    const paraInserir: InscricaoCadastroDto[] = [];

    for (const curso of cursos) {
      if (!curso.turmaId || !curso.status) continue;

      const existente = porTurma.get(curso.turmaId);

      if (curso.status === StatusTurma.NAO_INICIADO) {
        if (existente) {
          await this.repo.softDelete(existente.inscricaoId, atualizadoPor);
        }
        continue;
      }

      if (!existente) {
        paraInserir.push(curso);
        continue;
      }

      const dataConclusao =
        curso.status === StatusTurma.CONCLUIDO
          ? (curso.dataConclusao ?? existente.dataConclusao)
          : null;

      if (
        existente.status !== curso.status ||
        existente.dataConclusao !== dataConclusao
      ) {
        await this.repo.update(existente.inscricaoId, {
          status: curso.status,
          data_conclusao: dataConclusao,
          atualizado_em: agora,
          atualizado_por: atualizadoPor,
        });
      }
    }

    await this.createFromCadastro(membroId, paraInserir, atualizadoPor);
  }
}
