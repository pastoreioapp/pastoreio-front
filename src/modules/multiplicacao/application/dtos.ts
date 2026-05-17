import type { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import type { StatusMultiplicacao } from "../domain/status-multiplicacao";

export interface CreateMultiplicacaoMembroDto {
  membroId: number;
  papelCelula?: PapelCelula | null;
  liderNovaCelula?: boolean;
  observacoes?: string | null;
}

export interface CreateMultiplicacaoDto {
  celulaOrigemId: number;
  nomeCelulaDestino: string;
  liderMembroId: number;
  dataMultiplicacao?: string | null;
  observacoes?: string | null;
  membros: CreateMultiplicacaoMembroDto[];
}

export interface MultiplicacaoMembroListItemDto {
  id: number;
  membroId: number;
  nome: string | null;
  papelCelula: PapelCelula | null;
  liderNovaCelula: boolean;
  observacoes: string | null;
}

export interface MultiplicacaoListItemDto {
  id: number;
  celulaOrigemId: number;
  celulaDestinoId: number | null;
  celulaDestinoNome: string | null;
  liderMembroId: number | null;
  liderNome: string | null;
  dataMultiplicacao: string | null;
  statusMultiplicacao: StatusMultiplicacao;
  observacoes: string | null;
  criadoEm: string;
  totalMembros: number;
  membros: MultiplicacaoMembroListItemDto[];
}
