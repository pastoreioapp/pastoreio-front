"use server";

import { createClient } from "@/shared/supabase/server";
import { InscricaoRepository } from "@/modules/cursos/infra/inscricao.repository";
import { HistoricoAvancosRepository } from "@/modules/trajetoria/infra/historico-avancos.repository";
import { InscricaoService } from "@/modules/cursos/application/inscricao.service";
import type { CursoDoMembroDto } from "@/modules/cursos/application/dtos";

async function getInscricaoService(): Promise<InscricaoService> {
  const supabase = await createClient();
  const repo = new InscricaoRepository(supabase);
  const historicoRepo = new HistoricoAvancosRepository(supabase);
  return new InscricaoService(repo, historicoRepo);
}

async function getAuditUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? user?.id ?? "sistema";
}

export async function getCursosDoMembro(membroId: number): Promise<CursoDoMembroDto[]> {
  const service = await getInscricaoService();
  return service.listCursosDoMembro(membroId);
}

export async function registrarAvancoInscricao(inscricaoId: number): Promise<void> {
  const service = await getInscricaoService();
  const audit = await getAuditUserId();
  await service.registrarInscricaoConcluida(inscricaoId, audit);
}
