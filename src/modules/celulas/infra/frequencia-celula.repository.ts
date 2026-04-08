import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostgrestError } from "@supabase/supabase-js";
import type { FrequenciaSyncLinha } from "../domain/frequencia-sync";

const TABLE = "frequencias_celula";

function pgErrorMessage(err: PostgrestError): string {
  const parts = [err.message, err.code && `(${err.code})`, err.details && String(err.details)]
    .filter(Boolean)
    .join(" ");
  return parts || "Erro no Supabase";
}

type FrequenciaRow = {
  id: number;
  encontro_id: number;
  membro_id: number;
  presente: boolean;
  justificado: boolean | null;
  justificativa: string | null;
  deletado: boolean;
};

export class FrequenciaCelulaRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /** DELETE físico de todas as linhas do encontro (inclui registros com soft delete), para liberar a FK antes de apagar o encontro. */
  async deleteHardByEncontroId(encontroId: number): Promise<void> {
    const { error } = await this.supabase
      .from(TABLE)
      .delete()
      .eq("encontro_id", encontroId);

    if (error) {
      console.error("Erro ao excluir frequências do encontro:", error);
      throw new Error(pgErrorMessage(error));
    }
  }

  async syncForEncontro(
    encontroId: number,
    linhas: FrequenciaSyncLinha[],
    audit: { por: string }
  ): Promise<void> {
    const { data: existentes, error: errSelect } = await this.supabase
      .from(TABLE)
      .select("id, membro_id")
      .eq("encontro_id", encontroId)
      .eq("deletado", false);

    if (errSelect) {
      console.error("Erro ao buscar frequências:", errSelect);
      throw new Error(pgErrorMessage(errSelect));
    }

    const rows = (existentes ?? []) as FrequenciaRow[];
    const porMembro = new Map(
      rows.map((r) => [Number(r.membro_id), r] as const)
    );
    const incoming = new Set(linhas.map((l) => Number(l.membroId)));
    const now = new Date().toISOString();

    const insercoes: {
      encontro_id: number;
      membro_id: number;
      presente: boolean;
      justificado: boolean;
      justificativa: string | null;
      criado_em: string;
      criado_por: string;
      deletado: boolean;
    }[] = [];

    for (const linha of linhas) {
      const membroId = Number(linha.membroId);
      const existente = porMembro.get(membroId);
      if (existente) {
        const { error } = await this.supabase
          .from(TABLE)
          .update({
            presente: linha.presente,
            justificado: linha.justificado,
            justificativa: linha.justificativa,
            atualizado_em: now,
            atualizado_por: audit.por,
            deletado: false,
          })
          .eq("id", existente.id);

        if (error) {
          console.error("Erro ao atualizar frequência:", error);
          throw new Error(pgErrorMessage(error));
        }
      } else {
        insercoes.push({
          encontro_id: encontroId,
          membro_id: membroId,
          presente: linha.presente,
          justificado: linha.justificado,
          justificativa: linha.justificativa,
          criado_em: now,
          criado_por: audit.por,
          deletado: false,
        });
      }
    }

    if (insercoes.length > 0) {
      const { error: errInsert } = await this.supabase.from(TABLE).insert(insercoes);
      if (errInsert) {
        console.error("Erro ao inserir frequências (lote):", errInsert);
        throw new Error(pgErrorMessage(errInsert));
      }
    }

    for (const row of rows) {
      if (!incoming.has(Number(row.membro_id))) {
        const { error } = await this.supabase
          .from(TABLE)
          .update({
            deletado: true,
            atualizado_em: now,
            atualizado_por: audit.por,
          })
          .eq("id", row.id);

        if (error) {
          console.error("Erro ao inativar frequência:", error);
          throw new Error(pgErrorMessage(error));
        }
      }
    }
  }
}
