export interface CursoDoMembroDto {
    inscricaoId: number;
    cursoNome: string;
    turmaNome: string;
    status: string;
    statusLabel: string;
    dataInicio: string | null;
    dataFim: string | null;
    dataConclusao: string | null;
}

export interface TurmaParaCadastroDto {
    turmaId: number;
    turmaNome: string;
    cursoId: number;
    cursoNome: string;
    dataInicio: string | null;
    dataFim: string | null;
}

export interface InscricaoCadastroDto {
    turmaId: number;
    status: string;
    dataConclusao?: string | null;
}
