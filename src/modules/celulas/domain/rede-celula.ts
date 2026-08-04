export enum RedeCelula {
  JOVENS = "Jovens",
  CASAIS = "Casais",
  CRIANCAS = "Crianças",
}

export const REDES_CELULA = [
  RedeCelula.JOVENS,
  RedeCelula.CASAIS,
  RedeCelula.CRIANCAS,
] as const;

export function isRedeCelula(value: unknown): value is RedeCelula {
  return (
    typeof value === "string" &&
    REDES_CELULA.includes(value as RedeCelula)
  );
}
