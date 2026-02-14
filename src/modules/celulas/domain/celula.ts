export interface Celula {
  id: number;
  grupoId: number | null;
  nome: string;
  diaSemana: string | null;
  horario: string | null;
  local: string | null;
  ativa: boolean;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}
