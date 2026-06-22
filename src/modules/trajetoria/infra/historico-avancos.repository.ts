import type { SupabaseClient } from "@supabase/supabase-js";
import type { TipoAvanco } from "../domain/tipo-avanco";

const TABLE = "historico_avancos_manuais";

export class HistoricoAvancosRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async registrar(
    membroId: number,
    tipo: TipoAvanco,
    referenciaId: number,
    registradoPor: string,
    observacao?: string | null,
  ): Promise<void> {
    const { error } = await this.supabase.from(TABLE).insert({
      membro_id: membroId,
      tipo,
      referencia_id: referenciaId,
      registrado_por: registradoPor,
      observacao: observacao ?? null,
    });

    if (error) throw new Error(error.message);
  }
}
