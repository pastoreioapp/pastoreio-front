export interface TrajetoriaDoMembroDto {
  id: number;
  nome: string;
  grupos: GrupoComPassosDto[];
}

export interface GrupoComPassosDto {
  id: number;
  nome: string;
  ordem: number;
  passos: PassoDoMembroDto[];
}

export interface PassoDoMembroDto {
  id: number;
  nome: string;
  concluido: boolean;
}
