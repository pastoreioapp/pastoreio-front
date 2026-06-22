import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CelulaAtualDto,
  MembroDaCelulaListItemDto,
  VinculoHistoricoDto,
} from "../application/dtos";
import type { PapelCelula } from "../domain/papel-celula";
import {
  PAPEIS_CELULA_LIDERANCA,
  parsePapelCelula,
} from "../domain/papel-celula";
import { rowToMembroDaCelulaListItemDto } from "./membros-celula.mapper";

const TABLE = "membros_celula";

export interface MembroCelulaContext {
  celulaId: number;
  papelCelula: PapelCelula;
}

export class MembrosCelulaRepository {
  constructor(private supabase: SupabaseClient) {}

  async findMembrosByCelulaId(
    celulaId: number
  ): Promise<MembroDaCelulaListItemDto[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("id, celula_id, membro_id, papel_celula, data_entrada, deletado, membros(*)")
      .eq("celula_id", celulaId)
      .eq("deletado", false)
      .not("papel_celula", "in", `(${PAPEIS_CELULA_LIDERANCA.join(",")})`)
      .order("papel_celula", { ascending: true });

    if (error) throw error;

    const rows = (data ?? []) as unknown as Parameters<
      typeof rowToMembroDaCelulaListItemDto
    >[0][];
    return rows
      .filter((row) => row.membros && !row.membros.deletado)
      .map(rowToMembroDaCelulaListItemDto);
  }

  async findCelulaContextByMembroId(
    membroId: number,
    allowedRoles: readonly PapelCelula[],
  ): Promise<MembroCelulaContext | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("celula_id, papel_celula")
      .eq("membro_id", membroId)
      .eq("deletado", false)
      .is("data_saida", null)
      .in("papel_celula", [...allowedRoles])
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data?.celula_id || !data?.papel_celula) {
      return null;
    }

    const papelCelula = parsePapelCelula(data.papel_celula);
    if (!papelCelula) {
      return null;
    }

    return {
      celulaId: Number(data.celula_id),
      papelCelula,
    };
  }

  async findMembrosByCelulaIdNaData(
    celulaId: number,
    data: string,
  ): Promise<MembroDaCelulaListItemDto[]> {
    const { data: rows, error } = await this.supabase
      .from(TABLE)
      .select("id, celula_id, membro_id, papel_celula, data_entrada, deletado, membros(*)")
      .eq("celula_id", celulaId)
      .eq("deletado", false)
      .or(`data_saida.is.null,data_saida.gte.${data}`)
      .order("papel_celula", { ascending: true });

    if (error) throw new Error(error.message);

    return ((rows ?? []) as unknown as Parameters<typeof rowToMembroDaCelulaListItemDto>[0][])
      .filter((row) => row.membros && !row.membros.deletado)
      .map(rowToMembroDaCelulaListItemDto);
  }

  async findVinculoById(
    vinculoId: number,
  ): Promise<{ id: number; dataSaida: string | null } | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("id, data_saida")
      .eq("id", vinculoId)
      .eq("deletado", false)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return { id: data.id, dataSaida: data.data_saida };
  }

  async findVinculoAtivoByMembroId(membroId: number): Promise<CelulaAtualDto | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("celula_id, papel_celula, data_entrada, celulas!inner(nome)")
      .eq("membro_id", membroId)
      .eq("deletado", false)
      .is("data_saida", null)
      .order("data_entrada", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data?.celula_id) return null;

    const papelCelula = parsePapelCelula(data.papel_celula);
    if (!papelCelula) return null;

    const celula = data.celulas as { nome: string | null };

    return {
      celulaId: Number(data.celula_id),
      celulaNome: celula?.nome ?? "Célula",
      papelCelula,
      dataEntrada: data.data_entrada != null ? String(data.data_entrada) : null,
    };
  }

  async findHistoricoByMembroId(membroId: number): Promise<VinculoHistoricoDto[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("id, celula_id, papel_celula, data_entrada, data_saida, celulas!inner(nome)")
      .eq("membro_id", membroId)
      .eq("deletado", false)
      .order("data_entrada", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
      const celula = row.celulas as { nome: string | null };
      return {
        vinculoId: Number(row.id),
        celulaId: Number(row.celula_id),
        celulaNome: celula?.nome ?? "Célula",
        papelCelula: parsePapelCelula(row.papel_celula),
        dataEntrada: row.data_entrada != null ? String(row.data_entrada) : null,
        dataSaida: row.data_saida != null ? String(row.data_saida) : null,
      };
    });
  }

  async desvincular(vinculoId: number, desvinculadoPor: string): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await this.supabase
      .from(TABLE)
      .update({
        data_saida: now.split("T")[0],
        desvinculado_por: desvinculadoPor,
        atualizado_em: now,
        atualizado_por: desvinculadoPor,
      })
      .eq("id", vinculoId);

    if (error) throw new Error(error.message);
  }
}
