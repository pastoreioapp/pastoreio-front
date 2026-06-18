"use server";

import { createClient } from "@/shared/supabase/server";
import { FrequenciaMembroRepository } from "@/modules/frequencias/infra/frequencia-membro.repository";
import { FrequenciaMembroService } from "@/modules/frequencias/application/frequencia-membro.service";
import type { FrequenciaDoMembroDto } from "@/modules/frequencias/application/dtos";

async function getFrequenciaMembroService(): Promise<FrequenciaMembroService> {
  const supabase = await createClient();
  const repo = new FrequenciaMembroRepository(supabase);
  return new FrequenciaMembroService(repo);
}

export async function getFrequenciasDoMembro(membroId: number): Promise<FrequenciaDoMembroDto[]> {
  const service = await getFrequenciaMembroService();
  return service.listFrequenciasDoMembro(membroId);
}
