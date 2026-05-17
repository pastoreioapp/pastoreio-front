export type MultiplicacaoRow = {
  id: number;
  celula_origem_id: number;
  celula_destino_id: number | null;
  lider_membro_id: number | null;
  data_multiplicacao: string | null;
  status_multiplicacao: string | null;
  observacoes: string | null;
  criado_em: string;
  criado_por: string;
  atualizado_em: string | null;
  atualizado_por: string | null;
  deletado: boolean;
  celula_destino?: {
    nome: string | null;
  } | null;
  multiplicacao_membros?: MultiplicacaoMembroRow[];
};

export type MultiplicacaoMembroRow = {
  id: number;
  membro_id: number;
  multiplicacao_id: number | null;
  papel_celula: string | null;
  lider_nova_celula: boolean | null;
  observacoes: string | null;
  deletado: boolean;
  criado_em: string;
  criado_por: string;
  atualizado_em: string | null;
  atualizado_por: string | null;
  membros?: {
    nome: string | null;
  } | null;
};

export type CreateCelulaPayload = {
  nome: string;
  ativa: boolean;
  criado_em: string;
  criado_por: string;
  deletado: boolean;
};

export type CreateMultiplicacaoPayload = {
  celula_origem_id: number;
  celula_destino_id: number | null;
  lider_membro_id: number;
  data_multiplicacao: string | null;
  status_multiplicacao: string;
  observacoes: string | null;
  deletado: boolean;
  criado_em: string;
  criado_por: string;
};

export type CreateMultiplicacaoMembroPayload = {
  multiplicacao_id: number;
  membro_id: number;
  papel_celula: string | null;
  lider_nova_celula: boolean;
  observacoes: string | null;
  deletado: boolean;
  criado_em: string;
  criado_por: string;
};
