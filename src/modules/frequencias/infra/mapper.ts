interface EncontroJoin {
  data: string;
  tema: string;
}

export interface FrequenciaCelulaRow {
  id: number;
  presente: boolean;
  justificado: boolean | null;
  justificativa: string | null;
  encontros: EncontroJoin;
}

interface AulaJoin {
  data: string;
  tema: string | null;
}

interface InscricaoJoin {
  participante_id: number;
}

export interface FrequenciaCursoRow {
  id: number;
  presente: boolean;
  justificado: boolean;
  justificativa: string | null;
  aulas: AulaJoin;
  inscricoes: InscricaoJoin;
}

interface AcompanhamentoPastoralJoin {
  id: number;
  data: string;
  observacoes: string | null;
  tipo: string | null;
}

export interface AcompanhamentoPastoralRow {
  acompanhamentos_pastorais: AcompanhamentoPastoralJoin;
}
