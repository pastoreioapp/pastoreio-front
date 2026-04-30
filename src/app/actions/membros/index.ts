"use server";

import { createClient } from "@/shared/supabase/server";
import { MembroRepository } from "@/modules/secretaria/infra/membro.repository";
import { MembroService } from "@/modules/secretaria/application/membro.service";
import type { CreateMembroDto, UpdateMembroDto } from "@/modules/secretaria/application/dtos";
import { parsePapelCelula, PapelCelula } from "@/modules/celulas/domain/papel-celula";
import { revalidatePath } from "next/cache";

async function getMembroService(): Promise<MembroService> {
  const supabase = await createClient();
  const repo = new MembroRepository(supabase);
  return new MembroService(repo);
}

async function getAuditUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
  return { id: membro.id, userId: membro.userId, ativo: membro.ativo, dataNascimento: membro.dataNascimento };
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

    const dto: CreateMembroDto = {
      userId: null,
      nome: dadosPessoais.nome,
      email: dadosPessoais.email,
      telefone: dadosPessoais.telefone,
      dataNascimento: dadosPessoais.nascimento,
      endereco: dadosPessoais.endereco,
      estadoCivil: dadosPessoais.estadoCivil,
      conjuge: null,
      filhos: dadosPessoais.filhos,
      discipulador: dadosPessoais.discipulador,
      discipulando: dadosPessoais.discipulo,
      ministerio: dadosPessoais.ministerio,
      ativo: true,
    };

    const membro = await service.create(dto, audit);
    const supabase = await createClient();
    
    if (celulaId) {
      let papel = parsePapelCelula(dadosPessoais.cargo);
      if (!papel) papel = PapelCelula.MEMBRO;
      
      const { error: vinculoError } = await supabase.from("membros_celula").insert({
        celula_id: celulaId,
        membro_id: membro.id,
        papel_celula: papel,
        data_entrada: new Date().toISOString().split("T")[0],
        criado_em: new Date().toISOString(),
        criado_por: audit,
        deletado: false
      });

      if (vinculoError) throw new Error(`Erro ao vincular à célula: ${vinculoError.message}`);
    }
    if (cursos && cursos.length > 0) {
      console.log(`Recebemos ${cursos.length} cursos para o membro ${membro.id}`, cursos);
    }

    if (trajetoria && trajetoria.length > 0) {
       console.log(`Recebemos trajetoria para o membro ${membro.id}`, trajetoria);
    }
    
    revalidatePath("/membros");
    return { success: true, data: { id: membro.id } };
  } catch (error: any) {
    console.error("Erro na Server Action createMembroFromUI:", error);
    return { success: false, error: error.message };
  }
}