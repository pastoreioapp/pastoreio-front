import type { MembroPasso } from "../domain/trajetoria";
import type { TrajetoriaComGruposRow } from "../infra/mapper";
import type { TrajetoriaDoMembroDto } from "./dtos";

export function toTrajetoriaDoMembroDto(
  row: TrajetoriaComGruposRow,
  passosDoMembro: MembroPasso[],
): TrajetoriaDoMembroDto {
  const concluidosSet = new Set(
    passosDoMembro
      .filter((p) => p.dataConclusao != null)
      .map((p) => p.passoId),
  );

  return {
    id: row.id,
    nome: row.nome,
    grupos: row.grupos_trajetoria.map((g) => ({
      id: g.id,
      nome: g.nome,
      ordem: g.ordem ?? 0,
      passos: g.passos.map((p) => ({
        id: p.id,
        nome: p.nome,
        concluido: concluidosSet.has(p.id),
      })),
    })),
  };
}
