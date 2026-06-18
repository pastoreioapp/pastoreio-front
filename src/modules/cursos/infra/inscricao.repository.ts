import type { SupabaseClient } from "@supabase/supabase-js";
import type { InscricaoComCursoRow } from "./mapper";

export class InscricaoRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findCursosDoMembro(membroId: number): Promise<InscricaoComCursoRow[]> {
    const { data, error } = await this.supabase
      .from("inscricoes")
      .select(`
        id, data_inscricao,
        turmas!inner (
          id, nome, data_inicio, data_fim, status,
          cursos!inner (id, nome)
        )
      `)
      .eq("participante_id", membroId)
      .eq("deletado", false)
      .eq("turmas.deletado", false)
      .eq("turmas.cursos.deletado", false);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as InscricaoComCursoRow[];
  }
}
