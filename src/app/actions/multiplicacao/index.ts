"use server";

import type {
  CreateMultiplicacaoDto,
  MultiplicacaoListItemDto,
  UpdateMultiplicacaoDto,
} from "@/modules/multiplicacao/application/dtos";
import { MultiplicacaoService } from "@/modules/multiplicacao/application/multiplicacao.service";
import { MultiplicacaoRepository } from "@/modules/multiplicacao/infra/multiplicacao.repository";
import { createClient } from "@/shared/supabase/server";

async function getMultiplicacaoService(): Promise<MultiplicacaoService> {
  const supabase = await createClient();
  const repo = new MultiplicacaoRepository(supabase);
  return new MultiplicacaoService(repo);
}

async function getAuditUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("Usuario nao autenticado.");
  }

  return user.email ?? user.id;
}

export async function listMultiplicacoesDaCelula(
  celulaId: number,
): Promise<MultiplicacaoListItemDto[]> {
  const service = await getMultiplicacaoService();
  return service.list(celulaId);
}

export async function createMultiplicacao(
  dto: CreateMultiplicacaoDto,
): Promise<{ id: number; celulaDestinoId: number | null }> {
  const service = await getMultiplicacaoService();
  const audit = await getAuditUserId();
  return service.create(dto, audit);
}

export async function updateMultiplicacao(
  dto: UpdateMultiplicacaoDto,
): Promise<void> {
  const service = await getMultiplicacaoService();
  const audit = await getAuditUserId();
  await service.update(dto, audit);
}

export async function solicitarAnaliseMultiplicacao(
  multiplicacaoId: number,
  celulaOrigemId: number,
): Promise<void> {
  const service = await getMultiplicacaoService();
  const audit = await getAuditUserId();
  await service.solicitarAnalise(multiplicacaoId, celulaOrigemId, audit);
}

export async function finalizarMultiplicacao(
  multiplicacaoId: number,
  celulaOrigemId: number,
): Promise<void> {
  const service = await getMultiplicacaoService();
  const audit = await getAuditUserId();
  await service.finalizar(multiplicacaoId, celulaOrigemId, audit);
}

export async function deleteMultiplicacao(
  multiplicacaoId: number,
  celulaOrigemId: number,
): Promise<void> {
  const service = await getMultiplicacaoService();
  const audit = await getAuditUserId();
  await service.delete(multiplicacaoId, celulaOrigemId, audit);
}
