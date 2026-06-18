"use server";

import { createClient } from "@/shared/supabase/server";
import { MembroRepository } from "@/modules/secretaria/infra/membro.repository";
import { MembroService } from "@/modules/secretaria/application/membro.service";
import type {
    CreateMembroDto,
    UpdateMembroDto,
} from "@/modules/secretaria/application/dtos";
import {
    parsePapelCelula,
    PapelCelula,
} from "@/modules/celulas/domain/papel-celula";
import { revalidatePath } from "next/cache";

async function getMembroService(): Promise<MembroService> {
    const supabase = await createClient();
    const repo = new MembroRepository(supabase);
    return new MembroService(repo);
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

export async function deleteMembro(id: number) {
    const service = await getMembroService();
    await service.delete(id);
}

export async function createMembroFromUI(payload: any, celulaId?: number) {
    try {
        const { dadosPessoais, cursos, trajetoria } = payload;
        const service = await getMembroService();
        const audit = await getAuditUserId();
        const supabase = await createClient();

        const dto: CreateMembroDto = {
            userId: null,
            nome: dadosPessoais.nome,
            email: dadosPessoais.email,
            telefone: dadosPessoais.telefone,
            dataNascimento: dadosPessoais.nascimento,
            endereco: dadosPessoais.endereco,
            estadoCivil: dadosPessoais.estadoCivil,
            conjuge: dadosPessoais.conjuge || null,
            filhos: dadosPessoais.filhos,
            discipulador: dadosPessoais.discipulador,
            discipulando: dadosPessoais.discipulo,
            ministerio: dadosPessoais.ministerio,
            ativo: true,
        };

        const membro = await service.create(dto, audit);

        if (celulaId) {
            let papel = parsePapelCelula(dadosPessoais.cargo);
            if (!papel) papel = PapelCelula.MEMBRO;

            const { error: vinculoError } = await supabase
                .from("membros_celula")
                .insert({
                    celula_id: celulaId,
                    membro_id: membro.id,
                    papel_celula: papel,
                    data_entrada: new Date().toISOString().split("T")[0],
                    criado_em: new Date().toISOString(),
                    criado_por: audit,
                    deletado: false,
                });

            if (vinculoError)
                console.error(`Erro ao vincular à célula:`, vinculoError);
        }

        if (trajetoria && Array.isArray(trajetoria) && trajetoria.length > 0) {
            const passosIds = trajetoria.filter(
                (id: any) => typeof id === "number",
            );

            if (passosIds.length > 0) {
                const insercoesPassos = passosIds.map((passoId: number) => ({
                    membro_id: membro.id,
                    passo_id: passoId,
                    status: "Concluído",
                    data_conclusao: new Date().toISOString().split("T")[0],
                }));

                await supabase.from("membros_passos").insert(insercoesPassos);
            }
        }

        if (cursos && Array.isArray(cursos) && cursos.length > 0) {
            const cursosSelecionados = cursos.filter(
                (curso: any) =>
                    curso &&
                    curso.turmaId &&
                    curso.status &&
                    curso.status !== "A_FAZER",
            );

            if (cursosSelecionados.length > 0) {
                const agora = new Date().toISOString();

                const inscricoes = cursosSelecionados.map((curso: any) => ({
                    turma_id: curso.turmaId,
                    participante_id: membro.id,
                    data_inscricao: agora,
                    status: curso.status,
                    data_conclusao:
                        curso.status === "CONCLUIDO"
                            ? curso.dataConclusao
                            : null,
                    criado_em: agora,
                    criado_por: audit,
                    deletado: false,
                }));

                const { error } = await supabase
                    .from("inscricoes")
                    .insert(inscricoes);

                if (error) {
                    console.error("ERRO AO INSERIR INSCRIÇÕES:", error);
                    throw new Error(error.message);
                }
            }
        }

        revalidatePath("/membros");
        return { success: true, data: { id: membro.id } };
    } catch (error: any) {
        console.error("Erro na Server Action createMembroFromUI:", error);
        return { success: false, error: error.message };
    }
}
