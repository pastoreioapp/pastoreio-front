"use server";

import { createClient } from "@/shared/supabase/server";
import { MembroRepository } from "@/modules/secretaria/infra/membro.repository";
import { MembroService } from "@/modules/secretaria/application/membro.service";
import type { CreateMembroDto, UpdateMembroDto } from "@/modules/secretaria/application/dtos";

async function getMembroService(): Promise<MembroService> {
  const supabase = await createClient();
  const repo = new MembroRepository(supabase);
  return new MembroService(repo);
}

async function getAuditUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? user?.id ?? "sistema";
}

export async function listMembros() {
  const service = await getMembroService();
  return service.list();
}

export async function getMembro(id: number) {
  const service = await getMembroService();
  return service.get(id);
}

export async function createMembro(dto: CreateMembroDto) {
  const service = await getMembroService();
  const audit = await getAuditUserId();
  const membro = await service.create(dto, audit);
  return { id: membro.id, userId: membro.userId, ativo: membro.ativo, dataNascimento: membro.dataNascimento };
}

export async function updateMembro(id: number, dto: UpdateMembroDto) {
  const service = await getMembroService();
  const audit = await getAuditUserId();
  await service.update(id, dto, audit);
}

export async function deleteMembro(id: number) {
  const service = await getMembroService();
  await service.delete(id);
}
