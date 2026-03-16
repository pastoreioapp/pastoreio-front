import type { SupabaseClient } from "@supabase/supabase-js";
import { Perfil } from "../domain/types";

const TABLE = "user_profiles";

type UserProfileRow = {
  profile: string[] | null;
};

export class UserProfileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findOrCreateProfiles(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("profile")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar perfis do usuário: ${error.message}`);
    }

    const profileRow = data as UserProfileRow | null;
    if (
      profileRow?.profile &&
      Array.isArray(profileRow.profile) &&
      profileRow.profile.length > 0
    ) {
      return profileRow.profile;
    }

    const defaultProfiles = [Perfil.MEMBRO];

    const { error: insertError } = await this.supabase.from(TABLE).upsert(
      {
        user_id: userId,
        profile: defaultProfiles,
      },
      { onConflict: "user_id" }
    );

    if (insertError) {
      throw new Error(`Erro ao criar perfil do usuário: ${insertError.message}`);
    }

    return defaultProfiles;
  }
}
