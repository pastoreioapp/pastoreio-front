import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { MembrosCelulaRepository } from "@/modules/celulas/infra/membros-celula.repository";
import type { LoggedUserResponse } from "../domain/types";
import { PAPEIS_LIDERANCA_CELULA, Perfil } from "../domain/types";

async function getUserProfiles(
    supabase: SupabaseClient,
    userId: string,
): Promise<string[]> {
    const { data: userProfileRow, error: fetchError } = await supabase
        .from("user_profiles")
        .select("profile")
        .eq("user_id", userId)
        .maybeSingle();

    if (fetchError) throw new Error(`Erro ao buscar perfis do usuário: ${fetchError.message}`);

    if (
        userProfileRow?.profile &&
        Array.isArray(userProfileRow.profile) &&
        userProfileRow.profile.length > 0
    ) {
        return userProfileRow.profile as string[];
    }

    const { error: insertError } = await supabase.from("user_profiles").upsert(
        {
            user_id: userId,
            profile: [Perfil.MEMBRO],
        },
        { onConflict: "user_id" },
    );

    if (insertError) throw new Error(`Erro ao criar perfil do usuário: ${insertError.message}`);

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

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

async function getCelulaContext(
    supabase: SupabaseClient,
    membroId?: number,
) {
    if (membroId == null) {
        return null;
    }

    const membrosCelulaRepository = new MembrosCelulaRepository(supabase);
    return membrosCelulaRepository.findCelulaContextByMembroId(
        membroId,
        PAPEIS_LIDERANCA_CELULA,
    );
}

export async function mapSupabaseUserToLoggedUser(
    supabase: SupabaseClient,
    user: User | null,
): Promise<LoggedUserResponse | null> {
    if (!user) return null;

    const profiles = await getUserProfiles(
        supabase,
        user.id,
    );

    const { data: membroData, error: membroError } = await supabase
        .from("membros")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (membroError) {
        throw new Error(`Erro ao buscar membro do usuário: ${membroError.message}`);
    }

    const membroId = toOptionalNumber(membroData?.id);
    const celulaContext = await getCelulaContext(supabase, membroId);

    const fullName =
        membroData?.nome ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Usuário";

    const nameParts = fullName.split(" ");
    const nome = nameParts[0] || "";
    const sobrenome = nameParts.slice(1).join(" ") || "";

    const loginProvider = user.app_metadata?.provider || "email";

    return {
        id: membroId != null ? String(membroId) : user.id,
        membroId,
        nome: nome,
        sobrenome: sobrenome,
        login: user.email || "",
        email: membroData?.email || user.email || "",
        perfis: profiles,
        isUsuarioExterno: false,
        celulaId: celulaContext?.celulaId,
        papelCelula: celulaContext?.papelCelula,
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
