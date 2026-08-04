"use server";

import type {
  CelulaDetalheDto,
  CelulaListItemDto,
  MembroDaCelulaListItemDto,
} from "@/modules/celulas/application/dtos";
import { CelulaService } from "@/modules/celulas/application/celula.service";
import { MembrosCelulaService } from "@/modules/celulas/application/membros-celula.service";
import { CelulaRepository } from "@/modules/celulas/infra/celula.repository";
import { MembrosCelulaRepository } from "@/modules/celulas/infra/membros-celula.repository";
import { createClient } from "@/shared/supabase/server";

async function getMembrosCelulaService(): Promise<MembrosCelulaService> {
  const supabase = await createClient();
  const repo = new MembrosCelulaRepository(supabase);
  return new MembrosCelulaService(repo);
}

async function getCelulaService(): Promise<CelulaService> {
  const supabase = await createClient();
  const repo = new CelulaRepository(supabase);
  return new CelulaService(repo);
}

async function getAuditUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? user?.id ?? "sistema";
}

export async function listCelulas(): Promise<CelulaListItemDto[]> {
  const service = await getCelulaService();
  return service.list();
}

export async function getCelula(id: number): Promise<CelulaDetalheDto> {
  const service = await getCelulaService();
  return service.get(id);
}

export async function listMembrosDaCelula(
  celulaId: number
): Promise<MembroDaCelulaListItemDto[]> {
  const service = await getMembrosCelulaService();
  return service.listMembros(celulaId);
}

export async function listTodosMembrosDaCelula(
  celulaId: number,
): Promise<MembroDaCelulaListItemDto[]> {
  const service = await getMembrosCelulaService();
  return service.listTodosMembros(celulaId);
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
