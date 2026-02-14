import type { SupabaseClient } from "@supabase/supabase-js";
import type { Membro } from "../domain/membro";
import { rowToMembro, membroToRow } from "./mapper";

const TABLE = "membros";

export class MembroRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(): Promise<Membro[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("*")
      .eq("deletado", false)
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(rowToMembro);
  }

  async findById(id: number): Promise<Membro | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .eq("deletado", false)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToMembro(data) : null;
  }

  async save(membro: Membro): Promise<Membro> {
    if (membro.id) {
      const row = membroToRow(membro);
      delete (row as Record<string, unknown>).id;
      const { data, error } = await this.supabase
        .from(TABLE)
        .update(row)
        .eq("id", membro.id)
        .select()
        .single();
      if (error) throw error;
      return rowToMembro(data);
    }

    const row = membroToRow(membro);
    const { data, error } = await this.supabase
      .from(TABLE)
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return rowToMembro(data);
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from(TABLE)
      .update({ deletado: true, atualizado_em: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }
}
