import type { SupabaseClient } from "@supabase/supabase-js";
import type { TurmaComCursoRow } from "./mapper";

const TABLE = "turmas";

export class TurmaRepository {
    constructor(private readonly supabase: SupabaseClient) {}

    async findAtivasComCursoAtivo(): Promise<TurmaComCursoRow[]> {
        const { data, error } = await this.supabase
            .from(TABLE)
            .select(
                `
                id,
                nome,
                data_inicio,
                data_fim,
                cursos!inner (
                    id,
                    nome
                )
            `,
            )
            .eq("deletado", false)
            .eq("cursos.ativo", true)
            .eq("cursos.deletado", false)
            .order("data_inicio", { ascending: true });

        if (error) throw new Error(error.message);

        return (data ?? []) as unknown as TurmaComCursoRow[];
    }
}
