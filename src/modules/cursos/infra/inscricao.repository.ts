import type { SupabaseClient } from "@supabase/supabase-js";
import type { InscricaoComCursoRow } from "./mapper";

const TABLE = "inscricoes";

export interface InscricaoInsertPayload {
    turma_id: number;
    participante_id: number;
    data_inscricao: string;
    status: string;
    data_conclusao: string | null;
    criado_em: string;
    criado_por: string;
    deletado: boolean;
}

export class InscricaoRepository {
    constructor(private readonly supabase: SupabaseClient) {}

    async findCursosDoMembro(
        membroId: number,
    ): Promise<InscricaoComCursoRow[]> {
        const { data, error } = await this.supabase
            .from(TABLE)
            .select(
                `
                id,
                data_inscricao,
                status,
                data_conclusao,
                turmas!inner (
                    id,
                    nome,
                    data_inicio,
                    data_fim,
                    status,
                    cursos!inner (
                        id,
                        nome
                    )
                )
            `,
            )
            .eq("participante_id", membroId)
            .eq("deletado", false)
            .eq("turmas.deletado", false)
            .eq("turmas.cursos.deletado", false);

        if (error) throw new Error(error.message);

        return (data ?? []) as unknown as InscricaoComCursoRow[];
    }

    async insertMany(payloads: InscricaoInsertPayload[]): Promise<void> {
        if (payloads.length === 0) return;

        const { error } = await this.supabase.from(TABLE).insert(payloads);

        if (error) throw new Error(error.message);
    }
}
