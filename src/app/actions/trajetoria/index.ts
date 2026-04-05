"use server";

import { createClient } from "@/shared/supabase/server";
import { TrajetoriaRepository } from "@/modules/trajetoria/infra/trajetoria.repository";
import { TrajetoriaService } from "@/modules/trajetoria/application/trajetoria.service";
import type { TrajetoriaDoMembroDto } from "@/modules/trajetoria/application/dtos";

async function getTrajetoriaService(): Promise<TrajetoriaService> {
  const supabase = await createClient();
  const repo = new TrajetoriaRepository(supabase);
  return new TrajetoriaService(repo);
}

export async function getTrajetoriaDoMembro(membroId: number): Promise<TrajetoriaDoMembroDto | null> {
  const service = await getTrajetoriaService();
  return service.getTrajetoriaDoMembro(membroId);
}
