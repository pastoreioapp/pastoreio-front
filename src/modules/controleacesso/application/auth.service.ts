import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { LoggedUserResponse } from "../domain/types";
import { Perfil } from "../domain/types";

async function getUserProfiles(
    supabase: SupabaseClient,
    userId: string,
    userMetadata?: Record<string, unknown>,
): Promise<string[]> {
    const profiles = userMetadata?.profiles;
    if (Array.isArray(profiles)) return profiles;

    const profile = userMetadata?.profile;
    if (profile) {
        return Array.isArray(profile)
            ? (profile as string[])
            : [profile as string];
    }

    return [Perfil.MEMBRO];
}

function formatPhone(phone?: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.startsWith("55") && cleaned.length > 11) {
     cleaned = cleaned.substring(2);
  }
  
  return cleaned;
}

export async function mapSupabaseUserToLoggedUser(
    supabase: SupabaseClient,
    user: User | null,
): Promise<LoggedUserResponse | null> {
    if (!user) return null;

    const profiles = await getUserProfiles(
        supabase,
        user.id,
        user.user_metadata,
    );

    const { data: membroData } = await supabase
        .from("membros")
        .select("*")
        .eq("user_id", user.id)
        .single();

    const fullName =
        membroData?.nome ||
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

    const loginProvider = user.app_metadata?.provider || "email";

    return {
        id: numericId || 1,
        nome: nome,
        sobrenome: sobrenome,
        login: user.email || "",
        email: membroData?.email || user.email || "",
        perfis: profiles,
        isUsuarioExterno: false,
        telefone: formatPhone(
            membroData?.telefone ||
                user.phone ||
                user.user_metadata?.phone ||
                "",
        ),
        nascimento: membroData?.data_nascimento || "",
        endereco: membroData?.endereco || "",
        estadoCivil: membroData?.estado_civil || "",
        conjuge: membroData?.conjuge || "",
        filhos: membroData?.filhos || "Não",
        ministerio: membroData?.ministerio || "",
        funcao: membroData?.funcao || "",
        provider: loginProvider,
    };
}

export async function getCurrentUser(
    supabase: SupabaseClient,
): Promise<LoggedUserResponse | null> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    return mapSupabaseUserToLoggedUser(supabase, user);
}
