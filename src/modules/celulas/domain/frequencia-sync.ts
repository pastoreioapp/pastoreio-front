/** Payload para gravar linhas em `frequencias_celula` (sem campos de auditoria). */
export interface FrequenciaSyncLinha {
  membroId: number;
  presente: boolean;
  justificado: boolean;
  justificativa: string | null;
}
