"use server";

import type { Encontro } from "@/modules/celulas/domain/encontro";
import type { FrequenciaSyncLinha } from "@/modules/celulas/domain/frequencia-sync";
import { EncontroService } from "@/modules/celulas/application/encontro.service";
import { FrequenciaCelulaService } from "@/modules/celulas/application/frequencia-celula.service";
import { EncontroRepository } from "@/modules/celulas/infra/encontro.repository";
import { FrequenciaCelulaRepository } from "@/modules/celulas/infra/frequencia-celula.repository";
import { MembrosCelulaRepository } from "@/modules/celulas/infra/membros-celula.repository";
import { createClient } from "@/shared/supabase/server";

/** Formulário do modal (evita importar componente client na action). */
export type DadosEncontroForm = {
  tema: string;
  data: string;
  horario: string;
  local: string;
  anfitriao: string;
  preletor: string;
  supervisao: "sim" | "não";
  conversoes: "sim" | "não";
  observacoes?: string;
};

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

/** Uma única action: mesmo cliente Supabase para encontro + frequência (evita inconsistência de sessão entre chamadas). */
export async function salvarEncontroComFrequencias(payload: {
  celulaId: number;
  editandoId: string | null;
  dados: DadosEncontroForm;
  frequencias: FrequenciaSyncLinha[];
}): Promise<{ encontroId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? "UNKNOWN";

  const encRepo = new EncontroRepository(supabase);
  const encService = new EncontroService(encRepo);

  const horarioSql = `${payload.dados.horario}:00`;

  let encontroId: string;

  if (payload.editandoId) {
    const atualizado = await encService.update(payload.editandoId, {
      celula_id: String(payload.celulaId),
      data: payload.dados.data,
      tema: payload.dados.tema,
      horario: horarioSql,
      local: payload.dados.local,
      anfitriao: payload.dados.anfitriao,
      preletor: payload.dados.preletor,
      supervisao: payload.dados.supervisao === "sim",
      conversoes: payload.dados.conversoes === "sim",
      observacoes: payload.dados.observacoes,
      atualizado_em: new Date().toISOString(),
      atualizado_por: email,
    });
    if (atualizado.id == null || atualizado.id === "") {
      throw new Error("Encontro atualizado sem ID retornado.");
    }
    encontroId = String(atualizado.id);
  } else {
    const criado = await encService.create({
      celula_id: String(payload.celulaId),
      data: payload.dados.data,
      tema: payload.dados.tema,
      horario: horarioSql,
      local: payload.dados.local,
      anfitriao: payload.dados.anfitriao,
      preletor: payload.dados.preletor,
      supervisao: payload.dados.supervisao === "sim",
      conversoes: payload.dados.conversoes === "sim",
      observacoes: payload.dados.observacoes,
      criado_em: new Date().toISOString(),
      criado_por: email,
    });
    if (criado.id == null || criado.id === "") {
      throw new Error("Encontro criado sem ID retornado.");
    }
    encontroId = String(criado.id);
  }

  const membroRepo = new MembrosCelulaRepository(supabase);
  const membros = await membroRepo.findMembrosByCelulaIdNaData(payload.celulaId, payload.dados.data);
  const permitidos = new Set(membros.map((m) => Number(m.id)));

  for (const l of payload.frequencias) {
    const mid = Number(l.membroId);
    if (!Number.isFinite(mid) || !permitidos.has(mid)) {
      throw new Error(`Membro ${l.membroId} não pertence a esta célula.`);
    }
  }

  const encIdNum = Number(encontroId);
  if (!Number.isFinite(encIdNum)) {
    throw new Error("ID do encontro inválido após salvar.");
  }

  const freqRepo = new FrequenciaCelulaRepository(supabase);
  const freqService = new FrequenciaCelulaService(freqRepo);
  await freqService.syncForEncontro(encIdNum, payload.frequencias, { por: email });

  return { encontroId };
}

/** Persiste linhas em `frequencias_celula`. Não reconsulta `encontros`: um SELECT extra costuma falhar por RLS
 *  logo após o insert do encontro, abortando o sync antes de gravar a frequência. O vínculo continua garantido
 *  por FK (`encontro_id`) e pelas políticas RLS em `frequencias_celula`. */
export async function syncFrequenciasParaEncontro(
  encontroId: string,
  celulaId: number,
  linhas: FrequenciaSyncLinha[]
): Promise<void> {
  const supabase = await createClient();
  const encIdStr = String(encontroId).trim();
  if (!encIdStr) {
    throw new Error("ID do encontro inválido.");
  }

  const { data: encontroRow, error: errEncontro } = await supabase
    .from("encontros")
    .select("data")
    .eq("id", encIdStr)
    .single();
  if (errEncontro) throw new Error(errEncontro.message);
  const dataEncontro: string = encontroRow.data;

  const membroRepo = new MembrosCelulaRepository(supabase);
  const membros = await membroRepo.findMembrosByCelulaIdNaData(celulaId, dataEncontro);
  const permitidos = new Set(membros.map((m) => Number(m.id)));

  for (const l of linhas) {
    const mid = Number(l.membroId);
    if (!Number.isFinite(mid) || !permitidos.has(mid)) {
      throw new Error(`Membro ${l.membroId} não pertence a esta célula.`);
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const por = user?.email ?? "UNKNOWN";

  const freqRepo = new FrequenciaCelulaRepository(supabase);
  const freqService = new FrequenciaCelulaService(freqRepo);
  const encIdNum = Number(encIdStr);
  if (!Number.isFinite(encIdNum)) {
    throw new Error("ID do encontro inválido.");
  }
  await freqService.syncForEncontro(encIdNum, linhas, { por });
}
