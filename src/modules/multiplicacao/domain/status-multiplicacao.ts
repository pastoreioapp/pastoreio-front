export enum StatusMultiplicacao {
  EM_PLANEJAMENTO = "Em planejamento",
  EM_ANALISE = "Em análise",
  AUTORIZADA = "Autorizada",
  FINALIZADA = "Finalizada",
}

export const STATUS_MULTIPLICACAO = [
  StatusMultiplicacao.EM_PLANEJAMENTO,
  StatusMultiplicacao.EM_ANALISE,
  StatusMultiplicacao.AUTORIZADA,
  StatusMultiplicacao.FINALIZADA,
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
    return StatusMultiplicacao.EM_PLANEJAMENTO;
  }

  const normalized = value.trim();
  if (isStatusMultiplicacao(normalized)) {
    return normalized;
  }

  const legacyStatus: Record<string, StatusMultiplicacao> = {
    PLANEJADA: StatusMultiplicacao.EM_PLANEJAMENTO,
    EM_ANDAMENTO: StatusMultiplicacao.EM_ANALISE,
    CONCLUIDA: StatusMultiplicacao.FINALIZADA,
    CANCELADA: StatusMultiplicacao.EM_PLANEJAMENTO,
  };

  return legacyStatus[normalized.toUpperCase()] ?? StatusMultiplicacao.EM_PLANEJAMENTO;
}
