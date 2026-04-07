import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  FrequenciaCelulaRow,
  FrequenciaCursoRow,
  AcompanhamentoPastoralRow,
} from "./mapper";

export class FrequenciaMembroRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findFrequenciasCelula(membroId: number): Promise<FrequenciaCelulaRow[]> {
    const { data, error } = await this.supabase
      .from("frequencias_celula")
      .select(`
        id, presente, justificado, justificativa,
        encontros!inner (data, tema)
      `)
      .eq("membro_id", membroId)
      .eq("deletado", false)
      .eq("encontros.deletado", false);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as FrequenciaCelulaRow[];
  }

  async findFrequenciasCurso(membroId: number): Promise<FrequenciaCursoRow[]> {
    const { data, error } = await this.supabase
      .from("frequencias_curso")
      .select(`
        id, presente, justificado, justificativa,
        aulas!inner (data, tema),
        inscricoes!inner (participante_id)
      `)
      .eq("inscricoes.participante_id", membroId)
      .eq("deletado", false);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as FrequenciaCursoRow[];
  }

  async findAcompanhamentosPastorais(membroId: number): Promise<AcompanhamentoPastoralRow[]> {
    const { data, error } = await this.supabase
      .from("acompanhamento_pastoral_membros")
      .select(`
        acompanhamentos_pastorais!inner (id, data, observacoes, tipo)
      `)
      .eq("membro_id", membroId);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as AcompanhamentoPastoralRow[];
  }
}
