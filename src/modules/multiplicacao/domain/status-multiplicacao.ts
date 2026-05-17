export enum StatusMultiplicacao {
  PLANEJADA = "PLANEJADA",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
  CANCELADA = "CANCELADA",
}

export const STATUS_MULTIPLICACAO = [
  StatusMultiplicacao.PLANEJADA,
  StatusMultiplicacao.EM_ANDAMENTO,
  StatusMultiplicacao.CONCLUIDA,
  StatusMultiplicacao.CANCELADA,
] as const;

export function isStatusMultiplicacao(
  value: string,
): value is StatusMultiplicacao {
  return STATUS_MULTIPLICACAO.includes(value as StatusMultiplicacao);
}

export function parseStatusMultiplicacao(
  value: unknown,
): StatusMultiplicacao {
  if (typeof value !== "string") {
    return StatusMultiplicacao.PLANEJADA;
  }

  const normalized = value.trim().toUpperCase();
  return isStatusMultiplicacao(normalized)
    ? normalized
    : StatusMultiplicacao.PLANEJADA;
}
