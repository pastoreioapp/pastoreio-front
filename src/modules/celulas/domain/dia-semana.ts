export enum DiaSemana {
  DOMINGO = "Domingo",
  SEGUNDA = "Segunda-feira",
  TERCA = "Terça-feira",
  QUARTA = "Quarta-feira",
  QUINTA = "Quinta-feira",
  SEXTA = "Sexta-feira",
  SABADO = "Sábado",
}

export const DIAS_SEMANA = [
  DiaSemana.DOMINGO,
  DiaSemana.SEGUNDA,
  DiaSemana.TERCA,
  DiaSemana.QUARTA,
  DiaSemana.QUINTA,
  DiaSemana.SEXTA,
  DiaSemana.SABADO,
] as const;

export function isDiaSemana(value: unknown): value is DiaSemana {
  return (
    typeof value === "string" &&
    DIAS_SEMANA.includes(value as DiaSemana)
  );
}
