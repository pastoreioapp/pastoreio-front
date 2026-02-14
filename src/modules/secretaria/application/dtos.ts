export interface MembroListItemDto {
  id: number;
  userId: string;
  nome: string | null;
  funcao: string | null;
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
}

export interface MembroDetailDto {
  id: number;
  userId: string;
  nome: string | null;
  funcao: string | null;
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
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
}

export interface CreateMembroDto {
  userId: string;
  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;
  endereco?: string | null;
  estadoCivil?: string | null;
  conjuge?: string | null;
  filhos?: string | null;
  discipulador?: string | null;
  discipulando?: string | null;
  ministerio?: string | null;
  ativo: boolean;
}

export interface UpdateMembroDto {
  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;
  endereco?: string | null;
  estadoCivil?: string | null;
  conjuge?: string | null;
  filhos?: string | null;
  discipulador?: string | null;
  discipulando?: string | null;
  ministerio?: string | null;
  ativo?: boolean;
}
