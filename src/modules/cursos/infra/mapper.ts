export interface CursoRow {
    id: number;
    nome: string;
}

export interface TurmaComCursoRow {
    id: number;
    nome: string;
    data_inicio: string | null;
    data_fim: string | null;
    cursos: CursoRow;
}

interface TurmaRow {
    id: number;
    nome: string;
    data_inicio: string | null;
    data_fim: string | null;
    status: string | null;
    cursos: CursoRow;
}

export interface InscricaoComCursoRow {
    id: number;
    data_inscricao: string | null;
    status: string | null;
    data_conclusao: string | null;
    turmas: TurmaRow;
}
