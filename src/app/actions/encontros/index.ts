"use server";

import type { Encontro } from "@/modules/celulas/domain/encontro";
import { EncontroService } from "@/modules/celulas/application/encontro.service";
import { EncontroRepository } from "@/modules/celulas/infra/encontro.repository";
import { createClient } from "@/shared/supabase/server";

async function getEncontroService(): Promise<EncontroService> {
  const supabase = await createClient();
  const repo = new EncontroRepository(supabase);
  return new EncontroService(repo);
}

export async function listEncontros(celulaId: number): Promise<Encontro[]> {
  const service = await getEncontroService();
  return service.list(celulaId);
}

export async function createEncontro(dados: Encontro): Promise<Encontro> {
  const service = await getEncontroService();
  return service.create(dados);
}

export async function updateEncontro(
  id: string,
  dados: Partial<Encontro>
): Promise<Encontro> {
  const service = await getEncontroService();
  return service.update(id, dados);
}
