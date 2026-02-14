import type { Usuario } from "../domain/usuario";

/** Mock até integração com API real (PATCH /me). */
export async function patchUsuario(usuario: Usuario): Promise<Usuario> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(usuario);
    }, 1500);
  });
}
