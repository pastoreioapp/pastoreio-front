"use server";

import { createClient } from "@/shared/supabase/server";
import { TrajetoriaRepository } from "@/modules/trajetoria/infra/trajetoria.repository";
import { TrajetoriaService } from "@/modules/trajetoria/application/trajetoria.service";
import type { TrajetoriaMembroDto } from "@/modules/trajetoria/application/dtos";

export async function getTrajetoriaMembro(
  membroId: number
): Promise<TrajetoriaMembroDto | null> {
  const supabase = await createClient();
  const repo = new TrajetoriaRepository(supabase);
  const service = new TrajetoriaService(repo);
  return service.getTrajetoriaComProgressoDoMembro(membroId);
}
