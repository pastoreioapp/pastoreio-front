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
}
