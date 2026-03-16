import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  UsuarioMembroRecord,
  UsuarioPersistencePayload,
} from "./usuario.types";

const TABLE = "membros";

export class UsuarioRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getAuthenticatedUser(): Promise<User> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Usuário não autenticado");
    }

    return user;
  }

  async findByUserId(userId: string): Promise<UsuarioMembroRecord | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar membro do usuário: ${error.message}`);
    }

    return (data as UsuarioMembroRecord | null) ?? null;
  }

  async upsertByUserId(
    userId: string,
    payload: UsuarioPersistencePayload,
    auditUserId: string
  ): Promise<void> {
    const now = new Date().toISOString();

    const { data: updatedData, error: updateError } = await this.supabase
      .from(TABLE)
      .update({
        ...payload,
        atualizado_em: now,
        atualizado_por: auditUserId,
      })
      .eq("user_id", userId)
      .select("id");

    if (updateError) {
      throw new Error(`Erro no banco: ${updateError.message}`);
    }

    if (updatedData && updatedData.length > 0) {
      return;
    }

    const { error: insertError } = await this.supabase.from(TABLE).insert({
      user_id: userId,
      ativo: true,
      criado_em: now,
      criado_por: auditUserId,
      ...payload,
    });

    if (insertError) {
      throw new Error(`Erro ao criar perfil no banco: ${insertError.message}`);
    }
  }
}
