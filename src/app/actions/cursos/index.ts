"use server";

import { createClient } from "@/shared/supabase/server";
import { InscricaoRepository } from "@/modules/cursos/infra/inscricao.repository";
import { InscricaoService } from "@/modules/cursos/application/inscricao.service";
import type { CursoDoMembroDto } from "@/modules/cursos/application/dtos";

async function getInscricaoService(): Promise<InscricaoService> {
    const supabase = await createClient();
    const repo = new InscricaoRepository(supabase);
    return new InscricaoService(repo);
}

export async function getCursosDoMembro(
    membroId: number,
): Promise<CursoDoMembroDto[]> {
    const service = await getInscricaoService();
    return service.listCursosDoMembro(membroId);
}

export async function getCursosAtivosParaCadastro() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("turmas")
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

    if (error) {
        console.error("Erro ao buscar cursos:", error);
        return [];
    }

    return data;
}
