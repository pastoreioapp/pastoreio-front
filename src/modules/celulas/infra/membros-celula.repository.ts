import type { SupabaseClient } from "@supabase/supabase-js";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";
import { rowToMembroListItemDto } from "./membros-celula.mapper";

const TABLE = "membros_celula";

export class MembrosCelulaRepository {
  constructor(private supabase: SupabaseClient) {}

  async findMembrosByCelulaId(celulaId: number): Promise<MembroListItemDto[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("id, celula_id, membro_id, papel_celula, data_entrada, deletado, membros(*)")
      .eq("celula_id", celulaId)
      .eq("deletado", false)
      .order("papel_celula", { ascending: true });

    if (error) throw error;

    const rows = (data ?? []) as unknown as Parameters<typeof rowToMembroListItemDto>[0][];
    return rows
      .filter((row) => row.membros && !row.membros.deletado)
      .map(rowToMembroListItemDto);
  }
}
