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
