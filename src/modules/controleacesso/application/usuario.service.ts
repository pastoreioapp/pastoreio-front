import { createClient } from "@/shared/supabase/client";
import type { Usuario } from "../domain/usuario";
import { AvatarRepository } from "../infra/avatar.repository";
import { UsuarioRepository } from "../infra/usuario.repository";
import type { UsuarioPersistencePayload } from "../infra/usuario.types";

export async function patchUsuario(
    dados: Partial<Usuario>,
    avatarFile?: File,
): Promise<Partial<Usuario>> {
    const supabase = createClient();
    const usuarioRepository = new UsuarioRepository(supabase);
    const user = await usuarioRepository.getAuthenticatedUser();

    let avatarUrl: string | undefined;
    if (avatarFile) {
        const avatarRepo = new AvatarRepository(supabase);
        avatarUrl = await avatarRepo.upload(user.id, avatarFile);
    }

    const nomeCompleto = `${dados.nome || ""} ${dados.sobrenome || ""}`.trim();
    const telefoneLimpo = dados.telefone
        ? String(dados.telefone).replace(/\D/g, "")
        : "";

    const updatePayload: UsuarioPersistencePayload = {
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

    await usuarioRepository.upsertByUserId(user.id, updatePayload, user.id);

    return { ...dados, avatarUrl };
}
