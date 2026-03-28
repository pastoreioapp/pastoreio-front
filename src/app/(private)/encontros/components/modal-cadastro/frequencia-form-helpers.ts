import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import type { FrequenciaSyncLinha } from "@/modules/celulas/domain/frequencia-sync";

export type SituacaoFrequencia = "presente" | "justificado" | "faltou";

export type LinhaFrequenciaForm = {
  situacao: SituacaoFrequencia;
  justificativa: string;
};

export function buildFrequenciaFormInicial(
  membros: MembroDaCelulaListItemDto[],
  existentes?: Encontro["frequencia"]
): Record<number, LinhaFrequenciaForm> {
  const out: Record<number, LinhaFrequenciaForm> = {};
  for (const m of membros) {
    const f = existentes?.find((x) => Number(x.membro_id) === m.id);
    if (f) {
      if (f.presente) {
        out[m.id] = { situacao: "presente", justificativa: "" };
      } else if (f.justificado) {
        out[m.id] = {
          situacao: "justificado",
          justificativa: f.justificativa?.trim() ?? "",
        };
      } else {
        out[m.id] = { situacao: "faltou", justificativa: "" };
      }
    } else {
      out[m.id] = { situacao: "faltou", justificativa: "" };
    }
  }
  return out;
}

export function formToSyncLinhas(
  membros: MembroDaCelulaListItemDto[],
  form: Record<number, LinhaFrequenciaForm>
): FrequenciaSyncLinha[] {
  return membros.map((m) => {
    const row = form[m.id] ?? { situacao: "faltou" as const, justificativa: "" };
    switch (row.situacao) {
      case "presente":
        return {
          membroId: m.id,
          presente: true,
          justificado: false,
          justificativa: null,
        };
      case "justificado":
        return {
          membroId: m.id,
          presente: false,
          justificado: true,
          justificativa: row.justificativa.trim() || null,
        };
      default:
        return {
          membroId: m.id,
          presente: false,
          justificado: false,
          justificativa: null,
        };
    }
  });
}
