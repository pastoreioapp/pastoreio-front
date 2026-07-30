import type { CelulaDetalheDto, CelulaListItemDto } from "../application/dtos";
import { PapelCelula } from "../domain/papel-celula";
import type { CelulaListRow } from "./celula.types";

function getVinculosAtivos(row: CelulaListRow) {
  return (row.membros_celula ?? []).filter(
    (vinculo) =>
      !vinculo.deletado &&
      vinculo.data_saida == null &&
      vinculo.membros != null &&
      !vinculo.membros.deletado,
  );
}

export function rowToCelulaListItemDto(row: CelulaListRow): CelulaListItemDto {
  const vinculosAtivos = getVinculosAtivos(row);
  const lider = vinculosAtivos.find(
    (vinculo) => vinculo.papel_celula === PapelCelula.LIDER_CELULA,
  );

  return {
    id: Number(row.id),
    nome: String(row.nome),
    liderNome: lider?.membros?.nome ?? null,
    rede: row.rede != null ? String(row.rede) : null,
    ativa: Boolean(row.ativa),
    totalMembros: vinculosAtivos.length,
  };
}

export function rowToCelulaDetalheDto(row: CelulaListRow): CelulaDetalheDto {
  const listItem = rowToCelulaListItemDto(row);

  return {
    ...listItem,
    diaSemana: row.dia_semana != null ? String(row.dia_semana) : null,
    horario: row.horario != null ? String(row.horario) : null,
    local: row.local != null ? String(row.local) : null,
  };
}
