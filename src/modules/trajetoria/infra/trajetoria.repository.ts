import type { SupabaseClient } from "@supabase/supabase-js";
import type { MembroPasso } from "../domain/trajetoria";
import type { TrajetoriaComGruposRow, MembroPassoRow, PassoRow } from "./mapper";
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
      .eq("grupos_trajetoria.deletado", false)
      .eq("grupos_trajetoria.passos.deletado", false)
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

  async findPassosSoltos(trajetoriaId: number): Promise<PassoRow[]> {
    const { data, error } = await this.supabase
      .from("passos")
      .select("id, nome, ordem")
      .eq("trajetoria_id", trajetoriaId)
      .is("grupo_id", null)
      .eq("deletado", false)
      .order("ordem", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as PassoRow[];
  }

  async findPassosDoMembro(membroId: number): Promise<MembroPasso[]> {
    const { data, error } = await this.supabase
      .from("membros_passos")
      .select("passo_id, status, data_inicio, data_conclusao")
      .eq("membro_id", membroId);

    if (error) throw new Error(error.message);
    return (data as MembroPassoRow[] ?? []).map((r) => rowToMembroPasso(r, membroId));
  }

  async insertPassosConcluidos(
    membroId: number,
    passoIds: number[],
  ): Promise<void> {
    if (passoIds.length === 0) return;

    const hoje = new Date().toISOString().split("T")[0];
    const insercoes = passoIds.map((passoId) => ({
      membro_id: membroId,
      passo_id: passoId,
      status: "Concluído",
      data_conclusao: hoje,
    }));

    const { error } = await this.supabase
      .from("membros_passos")
      .upsert(insercoes, { onConflict: "membro_id,passo_id" });

    if (error) {
      if (/row-level security/i.test(error.message)) {
        throw new Error(
          "Sem permissão para registrar a trajetória do membro.",
        );
      }
      throw new Error(error.message);
    }
  }

  async deletePassos(membroId: number, passoIds: number[]): Promise<void> {
    if (passoIds.length === 0) return;

    const { error } = await this.supabase
      .from("membros_passos")
      .delete()
      .eq("membro_id", membroId)
      .in("passo_id", passoIds);

    if (error) throw new Error(error.message);
  }
}
