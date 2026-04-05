import type { SupabaseClient } from "@supabase/supabase-js";
import type { MembroPasso } from "../domain/trajetoria";
import type { TrajetoriaComGruposRow, MembroPassoRow } from "./mapper";
import { rowToMembroPasso } from "./mapper";

export class TrajetoriaRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAtiva(): Promise<TrajetoriaComGruposRow | null> {
    const { data, error } = await this.supabase
      .from("trajetoria")
      .select(`
        id, nome,
        grupos_trajetoria (
          id, nome, ordem,
          passos (id, nome, ordem)
        )
      `)
      .eq("ativa", true)
      .eq("deletado", false)
      .order("ordem", { referencedTable: "grupos_trajetoria", ascending: true })
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const row = data as unknown as TrajetoriaComGruposRow;

    row.grupos_trajetoria = (row.grupos_trajetoria ?? [])
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
      .map((g) => ({
        ...g,
        passos: (g.passos ?? []).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)),
      }));

    return row;
  }

  async findPassosDoMembro(membroId: number): Promise<MembroPasso[]> {
    const { data, error } = await this.supabase
      .from("membros_passos")
      .select("passo_id, status, data_inicio, data_conclusao")
      .eq("membro_id", membroId);

    if (error) throw new Error(error.message);
    return (data as MembroPassoRow[] ?? []).map((r) => rowToMembroPasso(r, membroId));
  }
}
