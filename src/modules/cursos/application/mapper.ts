import { parseStatusTurma, getStatusTurmaLabel } from "../domain/status-turma";
import type { InscricaoComCursoRow, TurmaComCursoRow } from "../infra/mapper";
import type { CursoDoMembroDto, TurmaParaCadastroDto } from "./dtos";

export function toCursoDoMembroDto(
    row: InscricaoComCursoRow,
): CursoDoMembroDto {
    const status = parseStatusTurma(row.status);

    return {
        inscricaoId: row.id,
        cursoNome: row.turmas.cursos.nome,
        turmaNome: row.turmas.nome,
        status,
        statusLabel: getStatusTurmaLabel(status),
        dataInicio: row.turmas.data_inicio,
        dataFim: row.turmas.data_fim,
        dataConclusao: row.data_conclusao,
    };
}

export function toTurmaParaCadastroDto(
    row: TurmaComCursoRow,
): TurmaParaCadastroDto {
    return {
        turmaId: row.id,
        turmaNome: row.nome,
        cursoId: row.cursos.id,
        cursoNome: row.cursos.nome,
        dataInicio: row.data_inicio,
        dataFim: row.data_fim,
    };
}
