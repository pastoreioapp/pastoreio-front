import type { MembroPasso } from "../domain/trajetoria";

interface PassoRow {
  id: number;
  nome: string;
  ordem: number | null;
}

interface GrupoRow {
  id: number;
  nome: string;
  ordem: number | null;
  passos: PassoRow[];
}

export interface TrajetoriaComGruposRow {
  id: number;
  nome: string;
  grupos_trajetoria: GrupoRow[];
}

export interface MembroPassoRow {
  passo_id: number;
  status: string | null;
  data_inicio: string | null;
  data_conclusao: string | null;
}

export function rowToMembroPasso(row: MembroPassoRow, membroId: number): MembroPasso {
  return {
    membroId,
    passoId: row.passo_id,
    status: row.status,
    dataInicio: row.data_inicio,
    dataConclusao: row.data_conclusao,
  };
}
