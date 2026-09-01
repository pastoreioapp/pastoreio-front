import type { PapelCelula } from "../domain/papel-celula";

export interface MembroDaCelulaListItemDto {
  id: number;
  vinculoId: number;
  celulaId: number;
  userId: string | null;
  nome: string | null;
  funcao: PapelCelula | null;
  email: string | null;
  telefone: string | null;
  dataNascimento: string | null;
  endereco: string | null;
  estadoCivil: string | null;
  conjuge: string | null;
  filhos: string | null;
  discipulador: string | null;
  discipulando: string | null;
  ministerio: string | null;
  avatarUrl: string | null;
  ativo: boolean;
  dataEntrada: string | null;
}

export interface CelulaListItemDto {
  id: number;
  nome: string;
  liderNome: string | null;
  rede: string | null;
  ativa: boolean;
  totalMembros: number;
}

export interface CelulaDetalheDto {
  id: number;
  nome: string;
  liderNome: string | null;
  rede: string | null;
  ativa: boolean;
  diaSemana: string | null;
  horario: string | null;
  local: string | null;
  totalMembros: number;
}

export interface CreateCelulaDto {
  nome: string;
  rede: string;
  liderMembroId?: number | null;
  diaSemana?: string | null;
  horario?: string | null;
  local?: string | null;
  ativa?: boolean;
}
