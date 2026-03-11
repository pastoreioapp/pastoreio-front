import type { PapelCelula } from "./papel-celula";

export interface MembroCelula {
  id: number;
  celulaId: number;
  membroId: number;
  papelCelula: PapelCelula | null;
  dataEntrada: string | null;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}
