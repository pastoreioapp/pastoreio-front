export type CelulaRow = {
  id: number;
  grupo_id: number | null;
  nome: string;
  rede: string | null;
  dia_semana: string | null;
  horario: string | null;
  local: string | null;
  ativa: boolean;
  criado_em: string;
  criado_por: string;
  atualizado_em: string | null;
  atualizado_por: string | null;
  deletado: boolean;
};

export type CelulaInsertPayload = {
  grupo_id: number | null;
  nome: string;
  rede: string | null;
  dia_semana: string | null;
  horario: string | null;
  local: string | null;
  ativa: boolean;
  criado_em: string;
  criado_por: string;
  deletado: boolean;
};

export type CelulaListRow = {
  id: number;
  nome: string;
  ativa: boolean;
  rede?: string | null;
  dia_semana?: string | null;
  horario?: string | null;
  local?: string | null;
  membros_celula: {
    id: number;
    papel_celula: string | null;
    deletado: boolean;
    data_saida: string | null;
    membros: {
      id: number;
      nome: string | null;
      deletado: boolean;
    } | null;
  }[] | null;
};
