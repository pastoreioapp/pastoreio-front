interface CursoRow {
  id: number;
  nome: string;
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
  turmas: TurmaRow;
}
