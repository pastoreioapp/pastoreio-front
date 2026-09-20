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
                cursos (
                    id,
                    nome,
                    ativo,
                    deletado
                )
            `,
            )
            .eq("deletado", false)
            .order("data_inicio", { ascending: true });

        if (error) throw new Error(error.message);

        return ((data ?? []) as unknown as TurmaComCursoRow[]).filter((row) => {
            const curso = Array.isArray(row.cursos) ? row.cursos[0] : row.cursos;
            if (!curso) return false;
            const extra = curso as { deletado?: boolean; ativo?: boolean | null };
            return extra.deletado !== true;
        });
    }
}
