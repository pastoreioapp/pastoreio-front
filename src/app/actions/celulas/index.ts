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

export async function listMembrosDaCelula(
  celulaId: number
): Promise<MembroDaCelulaListItemDto[]> {
  const service = await getMembrosCelulaService();
  return service.listMembros(celulaId);
}
