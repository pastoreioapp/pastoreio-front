export interface CursoDoMembroDto {
  inscricaoId: number;
  cursoNome: string;
  turmaNome: string;
  status: string;
  statusLabel: string;
  dataInicio: string | null;
  dataFim: string | null;
}
