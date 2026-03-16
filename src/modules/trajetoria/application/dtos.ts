export interface PassoProgressoDto {
  id: number;
  nome: string;
  concluido: boolean;
}

export interface GrupoTrajetoriaDto {
  id: number;
  nome: string;
  ordem: number;
  passos: PassoProgressoDto[];
}

export interface TrajetoriaMembroDto {
  trajetoriaId: number;
  trajetoriaNome: string;
  grupos: GrupoTrajetoriaDto[];
}
