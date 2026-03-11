import type { PapelCelula } from "@/modules/celulas/domain/papel-celula";

export interface UserLogin {
  login: string;
  password: string;
  loginType?: "email" | "phone";
}

export interface AuthResponse {
  access_token: string;
}

export interface LoggedUserResponse {
  id: string;
  membroId?: number;
  nome: string;
  sobrenome: string;
  login: string;
  email: string;
  telefone: string;
  perfis: Array<string>;
  isUsuarioExterno: boolean;
  celulaId?: number;
  papelCelula?: PapelCelula;
  nascimento?: string;
  endereco?: string;
  estadoCivil?: string;
  conjuge?: string;
  filhos?: "Sim" | "Não";
  ministerio?: string;
  funcao?: string;
  provider?: string;
}

export enum Perfil {
  ADMINISTRADOR_SISTEMA = "ADMINISTRADOR_SISTEMA",
  ADMINISTRADOR_IGREJA = "ADMINISTRADOR_IGREJA",
  LIDER_CELULA = "LIDER_CELULA",
  AUXILIAR_CELULA = "AUXILIAR_CELULA",
  MEMBRO = "MEMBRO",
}

export const CELULA_ROLES = [
  Perfil.ADMINISTRADOR_SISTEMA,
  Perfil.ADMINISTRADOR_IGREJA,
  Perfil.LIDER_CELULA,
  Perfil.AUXILIAR_CELULA,
];

export const PAPEIS_LIDERANCA_CELULA = [
  Perfil.LIDER_CELULA,
  Perfil.AUXILIAR_CELULA
] as const;