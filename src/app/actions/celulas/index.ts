"use server";

import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import { createClient } from "@/shared/supabase/server";
import { MembrosCelulaRepository } from "@/modules/celulas/infra/membros-celula.repository";
import { MembrosCelulaService } from "@/modules/celulas/application/membros-celula.service";

async function getMembrosCelulaService(): Promise<MembrosCelulaService> {
  const supabase = await createClient();
  const repo = new MembrosCelulaRepository(supabase);
  return new MembrosCelulaService(repo);
}

async function getAuditUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? user?.id ?? "sistema";
}

export async function listMembrosDaCelula(
  celulaId: number
): Promise<MembroDaCelulaListItemDto[]> {
  const service = await getMembrosCelulaService();
  return service.listMembros(celulaId);
}

export async function listMembrosDaCelulaParaData(
  celulaId: number,
  data: string,
): Promise<MembroDaCelulaListItemDto[]> {
  const service = await getMembrosCelulaService();
  return service.listMembrosNaData(celulaId, data);
}

export async function desvincularMembroDaCelula(
  vinculoId: number,
): Promise<void> {
  const service = await getMembrosCelulaService();
  const audit = await getAuditUserId();
  await service.desvincular(vinculoId, audit);
}
