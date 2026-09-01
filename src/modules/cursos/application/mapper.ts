import { parseStatusTurma, getStatusTurmaLabel } from "../domain/status-turma";
import type { CursoRow, InscricaoComCursoRow, TurmaComCursoRow } from "../infra/mapper";
import type { CursoDoMembroDto, TurmaParaCadastroDto } from "./dtos";

function primeiro<T>(valor: T | T[] | null | undefined): T | null {
    if (valor == null) return null;
    return Array.isArray(valor) ? (valor[0] ?? null) : valor;
}

function cursoDe(row: { cursos?: CursoRow | CursoRow[] | null }): CursoRow {
    const curso = primeiro(row.cursos);
    if (!curso) {
        throw new Error("Curso da turma não encontrado.");
    }
    return curso;
}

export function toCursoDoMembroDto(
    row: InscricaoComCursoRow,
): CursoDoMembroDto {
    const turma = primeiro(row.turmas);
    if (!turma) {
        throw new Error("Turma da inscrição não encontrada.");
    }

    const curso = cursoDe(turma);
    const status = parseStatusTurma(row.status);

    return {
        inscricaoId: row.id,
        turmaId: turma.id,
        cursoId: curso.id,
        cursoNome: curso.nome,
        turmaNome: turma.nome,
        status,
        statusLabel: getStatusTurmaLabel(status),
        dataInicio: turma.data_inicio,
        dataFim: turma.data_fim,
        dataConclusao: row.data_conclusao,
    };
}

export function toTurmaParaCadastroDto(
    row: TurmaComCursoRow,
): TurmaParaCadastroDto {
    const curso = cursoDe(row);
    return {
        turmaId: row.id,
        turmaNome: row.nome,
        cursoId: curso.id,
        cursoNome: curso.nome,
        dataInicio: row.data_inicio,
        dataFim: row.data_fim,
    };
}
