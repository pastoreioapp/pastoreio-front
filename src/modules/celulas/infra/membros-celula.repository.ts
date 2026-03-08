import type { SupabaseClient } from "@supabase/supabase-js";
import type { MembroDaCelulaListItemDto } from "../application/dtos";
import { rowToMembroDaCelulaListItemDto } from "./membros-celula.mapper";

const TABLE = "membros_celula";

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
}
