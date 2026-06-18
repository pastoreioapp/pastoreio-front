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

export async function getCursosDoMembro(membroId: number): Promise<CursoDoMembroDto[]> {
  const service = await getInscricaoService();
  return service.listCursosDoMembro(membroId);
}
