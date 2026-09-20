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

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToMembro);
  }

  async findById(id: number): Promise<Membro | null> {
    if (!Number.isFinite(id) || id <= 0) return null;

    const { data, error } = await this.supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .eq("deletado", false)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? rowToMembro(data) : null;
  }

  async updateCampos(
    id: number,
    campos: Record<string, unknown>,
  ): Promise<void> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .update(campos)
      .eq("id", id)
      .select("id");

    if (error) throw new Error(error.message);
    if (!data?.length) {
      throw new Error(
        "Sem permissão para atualizar o membro. Execute a policy de UPDATE em membros no Supabase.",
      );
    }
  }

  async save(membro: Membro): Promise<Membro> {
    if (membro.id) {
      const row = membroToRow(membro);
      delete (row as Record<string, unknown>).id;
      const { error } = await this.supabase
        .from(TABLE)
        .update(row)
        .eq("id", membro.id);

      if (error) throw new Error(error.message);
      return membro;
    }

    const row = membroToRow(membro);
    const { data, error } = await this.supabase
      .from(TABLE)
      .insert(row)
      .select("id")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Não foi possível cadastrar o membro.");
    return { ...membro, id: Number(data.id) };
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from(TABLE)
      .update({ deletado: true, atualizado_em: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
}
