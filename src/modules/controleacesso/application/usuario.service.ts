import { createClient } from "@/shared/supabase/client";
import type { Usuario } from "../domain/usuario";
import { AvatarRepository } from "../infra/avatar.repository";

export async function patchUsuario(
    dados: Partial<Usuario>,
    avatarFile?: File,
): Promise<Partial<Usuario>> {
    const supabase = createClient();

    const {
        data: { session },
        error: authError,
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (authError || !user) {
        throw new Error("Usuário não autenticado");
    }

    let avatarUrl: string | undefined;
    if (avatarFile) {
        const avatarRepo = new AvatarRepository(supabase);
        avatarUrl = await avatarRepo.upload(user.id, avatarFile);
    }

    const nomeCompleto = `${dados.nome || ""} ${dados.sobrenome || ""}`.trim();
    const telefoneLimpo = dados.telefone
        ? String(dados.telefone).replace(/\D/g, "")
        : "";

    const updatePayload: Record<string, unknown> = {
        nome: nomeCompleto,
        email: dados.email || null,
        telefone: telefoneLimpo,
        endereco: dados.endereco || null,
        data_nascimento: dados.nascimento ? dados.nascimento : null,
        estado_civil: dados.estadoCivil || null,
        conjuge: dados.conjuge || null,
        filhos: dados.filhos || "Não",
    };

    if (avatarUrl) {
        updatePayload.avatar_url = avatarUrl;
    }

    const { data: updatedData, error: dbError } = await supabase
        .from("membros")
        .update(updatePayload)
        .eq("user_id", user.id)
        .select();

    if (dbError) {
        throw new Error(`Erro no banco: ${dbError.message}`);
    }

    if (!updatedData || updatedData.length === 0) {
        const { error: insertError } = await supabase.from("membros").insert({
            user_id: user.id,
            ativo: true,
            criado_em: new Date().toISOString(),
            criado_por: user.id,
            ...updatePayload,
        });

        if (insertError) {
            throw new Error(
                `Erro ao criar perfil no banco: ${insertError.message}`,
            );
        }
    }

    return { ...dados, avatarUrl };
}
