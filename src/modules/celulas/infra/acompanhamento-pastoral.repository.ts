import type { SupabaseClient } from "@supabase/supabase-js";

const ACOMP_TABLE = "acompanhamento_pastoral_membros";
const ACOMP_PRINCIPAL_TABLE = "acompanhamentos_pastorais";

export class AcompanhamentoPastoralRepository {
    constructor(private readonly supabase: SupabaseClient) {}

    async findUltimaDataPorMembros(membroIds: number[]): Promise<Map<number, string>> {
        if (membroIds.length === 0) return new Map();

        const { data, error } = await this.supabase
            .from(ACOMP_TABLE)
            .select(`membro_id, ${ACOMP_PRINCIPAL_TABLE}(data)`)
            .in("membro_id", membroIds);

        if (error) throw new Error(error.message);

        const mapaUltimaData = new Map<number, string>();

        for (const row of data ?? []) {
            const membroId = Number(row.membro_id);
            const acompRaw = row[ACOMP_PRINCIPAL_TABLE];
            const acomp = (Array.isArray(acompRaw) ? acompRaw[0] : acompRaw) as { data: string } | null | undefined;
            if (!acomp?.data) continue;

            const dataExistente = mapaUltimaData.get(membroId);
            if (!dataExistente || acomp.data > dataExistente) {
                mapaUltimaData.set(membroId, acomp.data);
            }
        }

        return mapaUltimaData;
    }
}
