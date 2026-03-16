import type { GrupoTrajetoriaComProgresso } from "../domain/trajetoria";
import type { GrupoTrajetoriaDto, PassoProgressoDto } from "./dtos";

export function toGrupoTrajetoriaDto(
  grupo: GrupoTrajetoriaComProgresso
): GrupoTrajetoriaDto {
  return {
    id: grupo.id,
    nome: grupo.nome,
    ordem: grupo.ordem,
    passos: grupo.passos.map(toPassoProgressoDto),
  };
}

function toPassoProgressoDto(
  passo: GrupoTrajetoriaComProgresso["passos"][number]
): PassoProgressoDto {
  return {
    id: passo.id,
    nome: passo.nome,
    concluido: passo.concluido,
  };
}
