import type { StatusMultiplicacao } from "./status-multiplicacao";

export interface Multiplicacao {
  id: number;
  celulaOrigemId: number;
  celulaDestinoId: number | null;
  liderMembroId: number | null;
  dataMultiplicacao: string | null;
  statusMultiplicacao: StatusMultiplicacao;
  observacoes: string | null;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}
