import type { SupabaseClient } from "@supabase/supabase-js";

const CELULA_METAS_TABLE = "celula_metas";

export interface MetaComValor {
    metaId: number;
    nome: string;
    valorEsperado: number;
    valorAlcancado: number;
}

export class MetasCelulaRepository {
    constructor(private readonly supabase: SupabaseClient) {}

    async findByCelulaIdNoPeriodoAtual(celulaId: number): Promise<MetaComValor[]> {
        const hoje = new Date().toISOString().split("T")[0];

        const { data, error } = await this.supabase
            .from(CELULA_METAS_TABLE)
            .select("meta_id, valor_esperado, valor_alcancado, metas(id, nome, periodo_inicio, periodo_fim)")
            .eq("celula_id", celulaId)
            .eq("deletado", false);

        if (error) throw new Error(error.message);

        return (data ?? [])
            .filter((row) => {
                const metaRaw = row.metas;
                const meta = (Array.isArray(metaRaw) ? metaRaw[0] : metaRaw) as { id: number; nome: string; periodo_inicio: string | null; periodo_fim: string | null } | null;
                if (!meta) return false;
                if (meta.periodo_inicio && meta.periodo_inicio > hoje) return false;
                if (meta.periodo_fim && meta.periodo_fim < hoje) return false;
                return true;
            })
            .map((row) => {
                const metaRaw = row.metas;
                const meta = (Array.isArray(metaRaw) ? metaRaw[0] : metaRaw) as { id: number; nome: string };
                return {
                    metaId: meta.id,
                    nome: meta.nome,
                    valorEsperado: Number(row.valor_esperado ?? 0),
                    valorAlcancado: Number(row.valor_alcancado ?? 0),
                };
            });
    }
}
