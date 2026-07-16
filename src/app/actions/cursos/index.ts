"use server";

import { createClient } from "@/shared/supabase/server";
import { InscricaoRepository } from "@/modules/cursos/infra/inscricao.repository";
import { TurmaRepository } from "@/modules/cursos/infra/turma.repository";
import { InscricaoService } from "@/modules/cursos/application/inscricao.service";
import { TurmaService } from "@/modules/cursos/application/turma.service";
import type {
    CursoDoMembroDto,
    TurmaParaCadastroDto,
} from "@/modules/cursos/application/dtos";

async function getInscricaoService(): Promise<InscricaoService> {
    const supabase = await createClient();
    const repo = new InscricaoRepository(supabase);
    return new InscricaoService(repo);
}

async function getTurmaService(): Promise<TurmaService> {
    const supabase = await createClient();
    const repo = new TurmaRepository(supabase);
    return new TurmaService(repo);
}

export async function getCursosDoMembro(
    membroId: number,
): Promise<CursoDoMembroDto[]> {
    const service = await getInscricaoService();
    return service.listCursosDoMembro(membroId);
}

export async function getCursosAtivosParaCadastro(): Promise<
    TurmaParaCadastroDto[]
> {
    const service = await getTurmaService();
    return service.listAtivosParaCadastro();
}
