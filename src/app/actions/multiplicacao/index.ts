"use server";

import type {
  CreateMultiplicacaoDto,
  MultiplicacaoListItemDto,
} from "@/modules/multiplicacao/application/dtos";
import { MultiplicacaoService } from "@/modules/multiplicacao/application/multiplicacao.service";
import { MultiplicacaoRepository } from "@/modules/multiplicacao/infra/multiplicacao.repository";
import { createClient } from "@/shared/supabase/server";

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

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
  try {
    const service = await getMultiplicacaoService();
    return service.list(celulaId);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao carregar multiplicacoes da celula.";
    throw new Error(message);
  }
}

export async function createMultiplicacao(
  dto: CreateMultiplicacaoDto,
): Promise<ActionResult<{ id: number; celulaDestinoId: number | null }>> {
  try {
    const service = await getMultiplicacaoService();
    const audit = await getAuditUserId();
    const data = await service.create(dto, audit);
    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao registrar multiplicacao.";
    return { ok: false, error: message };
  }
}

export async function deleteMultiplicacao(
  multiplicacaoId: number,
  celulaOrigemId: number,
): Promise<void> {
  const service = await getMultiplicacaoService();
  const audit = await getAuditUserId();
  await service.delete(multiplicacaoId, celulaOrigemId, audit);
}
