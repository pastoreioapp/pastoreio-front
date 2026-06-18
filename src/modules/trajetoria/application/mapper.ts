import type { MembroPasso } from "../domain/trajetoria";
import type { TrajetoriaComGruposRow, PassoRow } from "../infra/mapper";
import type { TrajetoriaDoMembroDto, GrupoComPassosDto } from "./dtos";

export function toTrajetoriaDoMembroDto(
  row: TrajetoriaComGruposRow,
  passosDoMembro: MembroPasso[],
  passosSoltos: PassoRow[],
): TrajetoriaDoMembroDto {
  const concluidosSet = new Set(
    passosDoMembro
      .filter((p) => p.dataConclusao != null)
      .map((p) => p.passoId),
  );

  const grupos: GrupoComPassosDto[] = [];

  if (passosSoltos.length > 0) {
    grupos.push({
      id: 0,
      nome: row.nome,
      ordem: 0,
      passos: passosSoltos.map((p) => ({
        id: p.id,
        nome: p.nome,
        concluido: concluidosSet.has(p.id),
      })),
    });
  }

  grupos.push(
    ...row.grupos_trajetoria.map((g) => ({
      id: g.id,
      nome: g.nome,
      ordem: g.ordem ?? 0,
      passos: g.passos.map((p) => ({
        id: p.id,
        nome: p.nome,
        concluido: concluidosSet.has(p.id),
      })),
    })),
  );

  return { id: row.id, nome: row.nome, grupos };
}
