export enum PapelCelula {
  LIDER_CELULA = "LIDER_CELULA",
  AUXILIAR_CELULA = "AUXILIAR_CELULA",
  MEMBRO = "MEMBRO",
  VISITANTE = "VISITANTE",
}

export const PAPEIS_CELULA = [
  PapelCelula.LIDER_CELULA,
  PapelCelula.AUXILIAR_CELULA,
  PapelCelula.MEMBRO,
  PapelCelula.VISITANTE,
] as const;

export const PAPEIS_CELULA_LIDERANCA = [
  PapelCelula.LIDER_CELULA,
  PapelCelula.AUXILIAR_CELULA,
] as const;

export function isPapelCelula(value: string): value is PapelCelula {
  return PAPEIS_CELULA.includes(value as PapelCelula);
}

export function parsePapelCelula(value: unknown): PapelCelula | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  return isPapelCelula(normalized) ? normalized : null;
}
