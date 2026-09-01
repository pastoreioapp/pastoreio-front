"use server";

import { createClient } from "@/shared/supabase/server";
import { MembroRepository } from "@/modules/secretaria/infra/membro.repository";
import { MembroService } from "@/modules/secretaria/application/membro.service";
import { CadastroMembroService } from "@/modules/secretaria/application/cadastro-membro.service";
import { MembrosCelulaRepository } from "@/modules/celulas/infra/membros-celula.repository";
import { MembrosCelulaService } from "@/modules/celulas/application/membros-celula.service";
import { TrajetoriaRepository } from "@/modules/trajetoria/infra/trajetoria.repository";
import { TrajetoriaService } from "@/modules/trajetoria/application/trajetoria.service";
import { InscricaoRepository } from "@/modules/cursos/infra/inscricao.repository";
import { InscricaoService } from "@/modules/cursos/application/inscricao.service";
import type {
    CreateMembroDto,
    UpdateMembroDto,
} from "@/modules/secretaria/application/dtos";
import { revalidatePath } from "next/cache";

async function getMembroService(): Promise<MembroService> {
    const supabase = await createClient();
    const repo = new MembroRepository(supabase);
    return new MembroService(repo);
}

async function getMembrosCelulaService(): Promise<MembrosCelulaService> {
    const supabase = await createClient();
    const repo = new MembrosCelulaRepository(supabase);
    return new MembrosCelulaService(repo);
}

async function getTrajetoriaService(): Promise<TrajetoriaService> {
    const supabase = await createClient();
    const repo = new TrajetoriaRepository(supabase);
    return new TrajetoriaService(repo);
}

async function getInscricaoService(): Promise<InscricaoService> {
    const supabase = await createClient();
    const repo = new InscricaoRepository(supabase);
    return new InscricaoService(repo);
}

async function getCadastroMembroService(): Promise<CadastroMembroService> {
    return new CadastroMembroService(
        await getMembroService(),
        await getMembrosCelulaService(),
        await getTrajetoriaService(),
        await getInscricaoService(),
    );
}

async function getAuditUserId(): Promise<string> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
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
    return {
        id: membro.id,
        userId: membro.userId,
        ativo: membro.ativo,
        dataNascimento: membro.dataNascimento,
    };
}

export async function updateMembro(id: number, dto: UpdateMembroDto) {
    const service = await getMembroService();
    const audit = await getAuditUserId();
    await service.update(id, dto, audit);
}

export async function updateMembroFromUI(
    id: number,
    payload: any,
    celulaId?: number,
) {
    try {
        const service = await getCadastroMembroService();
        const audit = await getAuditUserId();
        await service.updateFromUI(id, payload, audit);

        revalidatePath("/membros");
        if (celulaId) {
            revalidatePath("/celulas");
            revalidatePath(`/celulas/${celulaId}`);
        }
        return { success: true };
    } catch (error: unknown) {
        console.error("Erro na Server Action updateMembroFromUI:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Não foi possível atualizar o membro.",
        };
    }
}

export async function deleteMembro(id: number) {
    const service = await getMembroService();
    await service.delete(id);
}

export async function createMembroFromUI(payload: any, celulaId?: number) {
    try {
        const service = await getCadastroMembroService();
        const audit = await getAuditUserId();

        const membro = await service.createFromUI(payload, celulaId, audit);

        revalidatePath("/membros");
        if (celulaId) {
            revalidatePath("/celulas");
            revalidatePath(`/celulas/${celulaId}`);
        }
        return { success: true, data: { id: membro.id } };
    } catch (error: any) {
        console.error("Erro na Server Action createMembroFromUI:", error);
        return { success: false, error: error.message };
    }
}