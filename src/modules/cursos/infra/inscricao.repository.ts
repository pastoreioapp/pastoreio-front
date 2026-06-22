import type { SupabaseClient } from "@supabase/supabase-js";
import type { InscricaoComCursoRow } from "./mapper";

export class InscricaoRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findCursosDoMembro(membroId: number): Promise<InscricaoComCursoRow[]> {
    const { data, error } = await this.supabase
      .from("inscricoes")
      .select(`
        id, data_inscricao, concluido_em,
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

  async findById(inscricaoId: number): Promise<{
    id: number;
    participanteId: number;
    concluidoEm: string | null;
  } | null> {
    const { data, error } = await this.supabase
      .from("inscricoes")
      .select("id, participante_id, concluido_em")
      .eq("id", inscricaoId)
      .eq("deletado", false)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      id: data.id,
      participanteId: data.participante_id,
      concluidoEm: data.concluido_em,
    };
  }

  async marcarConcluida(inscricaoId: number, concluidoPor: string): Promise<void> {
    const hoje = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString();

    const { error } = await this.supabase
      .from("inscricoes")
      .update({
        concluido_em: hoje,
        concluido_por: concluidoPor,
        atualizado_em: now,
        atualizado_por: concluidoPor,
      })
      .eq("id", inscricaoId);

    if (error) throw new Error(error.message);
  }
}
