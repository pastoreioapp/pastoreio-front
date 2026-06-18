export interface Trajetoria {
  id: number;
  nome: string;
  descricao: string | null;
  ativa: boolean;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}

export interface GrupoTrajetoria {
  id: number;
  trajetoriaId: number;
  nome: string;
  ordem: number | null;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}

export interface Passo {
  id: number;
  grupoId: number | null;
  trajetoriaId: number | null;
  nome: string;
  descricao: string | null;
  ordem: number | null;
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
  deletado: boolean;
}

export interface MembroPasso {
  membroId: number;
  passoId: number;
  status: string | null;
  dataInicio: string | null;
  dataConclusao: string | null;
}
