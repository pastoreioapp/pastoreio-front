import { parseStatusTurma, getStatusTurmaLabel } from "../domain/status-turma";
import type { InscricaoComCursoRow } from "../infra/mapper";
import type { CursoDoMembroDto } from "./dtos";

export function toCursoDoMembroDto(row: InscricaoComCursoRow): CursoDoMembroDto {
  const status = parseStatusTurma(row.turmas.status);

  return {
    inscricaoId: row.id,
    cursoNome: row.turmas.cursos.nome,
    turmaNome: row.turmas.nome,
    status,
    statusLabel: getStatusTurmaLabel(status),
    dataInicio: row.turmas.data_inicio,
    dataFim: row.turmas.data_fim,
  };
}
