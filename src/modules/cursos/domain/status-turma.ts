export enum StatusTurma {
  NAO_INICIADO = "NAO_INICIADO",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDO = "CONCLUIDO",
}

export const STATUS_TURMA = Object.values(StatusTurma);

const STATUS_LABELS: Record<StatusTurma, string> = {
  [StatusTurma.NAO_INICIADO]: "Não Iniciado",
  [StatusTurma.EM_ANDAMENTO]: "Em Andamento",
  [StatusTurma.CONCLUIDO]: "Concluído",
};

export function isStatusTurma(value: unknown): value is StatusTurma {
  return typeof value === "string" && STATUS_TURMA.includes(value as StatusTurma);
}

export function parseStatusTurma(value: string | null | undefined): StatusTurma {
  if (value && isStatusTurma(value)) return value;
  return StatusTurma.NAO_INICIADO;
}

export function getStatusTurmaLabel(status: StatusTurma): string {
  return STATUS_LABELS[status];
}
