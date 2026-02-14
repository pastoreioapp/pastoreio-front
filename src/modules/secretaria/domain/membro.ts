export interface Membro {
  id: number;
  userId: string;
  nome: string | null;
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
  deletado: boolean;
}
