export interface Passo {
  id: number;
  nome: string;
  descricao: string | null;
  ordem: number;
}

export interface PassoComProgresso extends Passo {
  concluido: boolean;
  dataConclusao: string | null;
}

export interface GrupoTrajetoria {
  id: number;
  nome: string;
  ordem: number;
  passos: Passo[];
}

export interface GrupoTrajetoriaComProgresso {
  id: number;
  nome: string;
  ordem: number;
  passos: PassoComProgresso[];
}

export interface Trajetoria {
  id: number;
  nome: string;
  descricao: string | null;
  ativa: boolean;
}
