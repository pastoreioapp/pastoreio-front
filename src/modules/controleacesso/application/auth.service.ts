import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { LoggedUserResponse } from "../domain/types";
import { Perfil } from "../domain/types";

async function getUserProfiles(
  supabase: SupabaseClient,
  userId: string,
  userMetadata?: Record<string, unknown>
): Promise<string[]> {
  try {
    const { data: profileData, error } = await supabase
      .from("user_profiles")
      .select("profile")
      .eq("user_id", userId)
      .single();

    if (!error && profileData) {
      return Array.isArray(profileData.profile)
        ? profileData.profile
        : [profileData.profile];
    }
  } catch {
    // Tabela não existe ou erro - continua para fallback
  }

  const profiles = userMetadata?.profiles;
  if (Array.isArray(profiles)) return profiles;

  const profile = userMetadata?.profile;
  if (profile) {
    return Array.isArray(profile) ? profile : [profile];
  }

  return [Perfil.MEMBRO];
}

export async function mapSupabaseUserToLoggedUser(
  supabase: SupabaseClient,
  user: User | null
): Promise<LoggedUserResponse | null> {
  if (!user) return null;

  const profiles = await getUserProfiles(supabase, user.id, user.user_metadata);

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Usuário";

  const nameParts = fullName.split(" ");
  const nome = nameParts[0] || "";
  const sobrenome = nameParts.slice(1).join(" ") || "";

  const numericId =
    user.id
      .split("-")
      .reduce((acc, part) => acc + parseInt(part.slice(0, 4), 16), 0) %
    2147483647;

  return {
    id: numericId || 1,
    nome,
    sobrenome,
    login: user.email || "",
    email: user.email || "",
    telefone: user.user_metadata?.phone || "",
    perfis: profiles,
    isUsuarioExterno: false,
  };
}

export async function getCurrentUser(
  supabase: SupabaseClient
): Promise<LoggedUserResponse | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return mapSupabaseUserToLoggedUser(supabase, user);
}
