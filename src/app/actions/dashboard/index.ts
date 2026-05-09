"use server";

import type { PulsoSemanaResult } from "@/modules/celulas/application/dashboard-dtos";
import type { MembroEmAtencaoResult } from "@/modules/celulas/application/atencao-dtos";
import type { SaudeCelulaResult } from "@/modules/celulas/application/saude-dtos";
import type { MetaCelulaDto } from "@/modules/metas/application/dtos";
import { PulsoCelulaService } from "@/modules/celulas/application/pulso-celula.service";
import { AtencaoCelulaService } from "@/modules/celulas/application/atencao-celula.service";
import { SaudeCelulaService } from "@/modules/celulas/application/saude-celula.service";
import { MetasCelulaService } from "@/modules/metas/application/metas-celula.service";
import { EncontroRepository } from "@/modules/celulas/infra/encontro.repository";
import { MembrosCelulaRepository } from "@/modules/celulas/infra/membros-celula.repository";
import { AcompanhamentoPastoralRepository } from "@/modules/celulas/infra/acompanhamento-pastoral.repository";
import { MetasCelulaRepository } from "@/modules/metas/infra/metas-celula.repository";
import { createClient } from "@/shared/supabase/server";
import { versiculoDoDia } from "@/app/(private)/dashboard/lib/versiculos";

async function getPulsoCelulaService(): Promise<PulsoCelulaService> {
    const supabase = await createClient();
    const encontroRepo = new EncontroRepository(supabase);
    return new PulsoCelulaService(encontroRepo);
}

async function getAtencaoCelulaService(): Promise<AtencaoCelulaService> {
    const supabase = await createClient();
    const encontroRepo = new EncontroRepository(supabase);
    const membrosCelulaRepo = new MembrosCelulaRepository(supabase);
    const acompanhamentoRepo = new AcompanhamentoPastoralRepository(supabase);
    return new AtencaoCelulaService(encontroRepo, membrosCelulaRepo, acompanhamentoRepo);
}

export async function getPulsoSemana(celulaId: number): Promise<PulsoSemanaResult> {
    const service = await getPulsoCelulaService();
    return service.get(celulaId);
}

export async function getMembrosEmAtencao(celulaId: number): Promise<MembroEmAtencaoResult[]> {
    const service = await getAtencaoCelulaService();
    return service.list(celulaId);
}

async function getMetasCelulaService(): Promise<MetasCelulaService> {
    const supabase = await createClient();
    const repo = new MetasCelulaRepository(supabase);
    return new MetasCelulaService(repo);
}

export async function getMetasCelula(celulaId: number): Promise<MetaCelulaDto[]> {
    const service = await getMetasCelulaService();
    return service.list(celulaId);
}

export async function getSaudeCelula(celulaId: number): Promise<SaudeCelulaResult> {
    const supabase = await createClient();
    const encontroRepo = new EncontroRepository(supabase);
    const membrosCelulaRepo = new MembrosCelulaRepository(supabase);
    const acompanhamentoRepo = new AcompanhamentoPastoralRepository(supabase);
    const metasRepo = new MetasCelulaRepository(supabase);

    const pulsoService = new PulsoCelulaService(encontroRepo);
    const atencaoService = new AtencaoCelulaService(encontroRepo, membrosCelulaRepo, acompanhamentoRepo);
    const metasService = new MetasCelulaService(metasRepo);

    const saudeService = new SaudeCelulaService(pulsoService, atencaoService, metasService);
    const versiculo = versiculoDoDia(celulaId);
    return saudeService.get(celulaId, versiculo);
}
