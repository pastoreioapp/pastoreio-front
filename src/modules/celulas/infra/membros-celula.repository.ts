import type { SupabaseClient } from "@supabase/supabase-js";
import type { MembroDaCelulaListItemDto } from "../application/dtos";
import type { PapelCelula } from "../domain/papel-celula";
import { parsePapelCelula } from "../domain/papel-celula";
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
}
