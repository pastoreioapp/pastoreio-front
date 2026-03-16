export interface UsuarioPersistencePayload {
  nome: string;
  email: string | null;
  telefone: string;
  endereco: string | null;
  data_nascimento: string | null;
  estado_civil: string | null;
  conjuge: string | null;
  filhos: "Sim" | "Não";
  avatar_url?: string;
}

export interface UsuarioMembroRecord {
  id: number | string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  data_nascimento: string | null;
  endereco: string | null;
  estado_civil: string | null;
  conjuge: string | null;
  filhos: "Sim" | "Não" | null;
  ministerio: string | null;
  funcao: string | null;
  avatar_url: string | null;
}
