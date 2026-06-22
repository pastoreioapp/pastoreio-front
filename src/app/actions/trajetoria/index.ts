"use server";

import { createClient } from "@/shared/supabase/server";
import { TrajetoriaRepository } from "@/modules/trajetoria/infra/trajetoria.repository";
import { HistoricoAvancosRepository } from "@/modules/trajetoria/infra/historico-avancos.repository";
import { TrajetoriaService } from "@/modules/trajetoria/application/trajetoria.service";
import type { TrajetoriaDoMembroDto } from "@/modules/trajetoria/application/dtos";

async function getTrajetoriaService(): Promise<TrajetoriaService> {
  const supabase = await createClient();
  const repo = new TrajetoriaRepository(supabase);
  const historicoRepo = new HistoricoAvancosRepository(supabase);
  return new TrajetoriaService(repo, historicoRepo);
}

async function getAuditUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? user?.id ?? "sistema";
}

export async function getTrajetoriaDoMembro(membroId: number): Promise<TrajetoriaDoMembroDto | null> {
  const service = await getTrajetoriaService();
  return service.getTrajetoriaDoMembro(membroId);
}

export async function registrarAvancoPasso(membroId: number, passoId: number): Promise<void> {
  const service = await getTrajetoriaService();
  const audit = await getAuditUserId();
  await service.registrarPassoConcluido(membroId, passoId, audit);
}
