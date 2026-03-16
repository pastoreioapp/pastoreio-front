import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Trajetoria,
  GrupoTrajetoriaComProgresso,
  PassoComProgresso,
} from "../domain/trajetoria";

interface GrupoPassoRow {
  grupo_id: number;
  grupo_nome: string;
  grupo_ordem: number;
  passo_id: number;
  passo_nome: string;
  passo_descricao: string | null;
  passo_ordem: number;
  membro_status: string | null;
  data_conclusao: string | null;
}

export class TrajetoriaRepository {
  constructor(private supabase: SupabaseClient) {}

  async findTrajetoriaAtiva(): Promise<Trajetoria | null> {
    const { data, error } = await this.supabase
      .from("trajetoria")
      .select("id, nome, descricao, ativa")
      .eq("ativa", true)
      .eq("deletado", false)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: Number(data.id),
      nome: String(data.nome),
      descricao: data.descricao != null ? String(data.descricao) : null,
      ativa: Boolean(data.ativa),
    };
  }

  async findGruposComProgressoDoMembro(
    trajetoriaId: number,
    membroId: number
  ): Promise<GrupoTrajetoriaComProgresso[]> {
    const { data, error } = await this.supabase.rpc(
      "get_trajetoria_progresso_membro",
      { p_trajetoria_id: trajetoriaId, p_membro_id: membroId }
    );

    if (error) throw error;

    const rows = (data ?? []) as GrupoPassoRow[];
    return this.agruparPorGrupo(rows);
  }

  private agruparPorGrupo(
    rows: GrupoPassoRow[]
  ): GrupoTrajetoriaComProgresso[] {
    const gruposMap = new Map<number, GrupoTrajetoriaComProgresso>();

    for (const row of rows) {
      let grupo = gruposMap.get(row.grupo_id);
      if (!grupo) {
        grupo = {
          id: row.grupo_id,
          nome: row.grupo_nome,
          ordem: row.grupo_ordem,
          passos: [],
        };
        gruposMap.set(row.grupo_id, grupo);
      }

      const passo: PassoComProgresso = {
        id: row.passo_id,
        nome: row.passo_nome,
        descricao: row.passo_descricao,
        ordem: row.passo_ordem,
        concluido: row.membro_status === "concluido",
        dataConclusao: row.data_conclusao,
      };
      grupo.passos.push(passo);
    }

    const grupos = Array.from(gruposMap.values());
    grupos.sort((a, b) => a.ordem - b.ordem);
    for (const g of grupos) {
      g.passos.sort((a, b) => a.ordem - b.ordem);
    }

    return grupos;
  }
}
