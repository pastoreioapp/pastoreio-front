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
  ativo: boolean;
  dataEntrada: string | null;
}
