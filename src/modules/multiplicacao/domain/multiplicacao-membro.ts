import type { PapelCelula } from "@/modules/celulas/domain/papel-celula";

export interface MultiplicacaoMembro {
  id: number;
  membroId: number;
  multiplicacaoId: number | null;
  papelCelula: PapelCelula | null;
  liderNovaCelula: boolean;
  observacoes: string | null;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}
