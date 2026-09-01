import type { CelulaDetalheDto, CelulaListItemDto } from "../application/dtos";
import type { Celula } from "../domain/celula";
import { PapelCelula } from "../domain/papel-celula";
import type { CelulaInsertPayload, CelulaListRow, CelulaRow } from "./celula.types";

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

export function rowToCelula(row: CelulaRow): Celula {
  return {
    id: Number(row.id),
    grupoId: row.grupo_id != null ? Number(row.grupo_id) : null,
    nome: String(row.nome),
    rede: row.rede != null ? String(row.rede) : null,
    diaSemana: row.dia_semana != null ? String(row.dia_semana) : null,
    horario: row.horario != null ? String(row.horario) : null,
    local: row.local != null ? String(row.local) : null,
    ativa: Boolean(row.ativa),
    criadoEm: String(row.criado_em),
    criadoPor: String(row.criado_por),
    atualizadoEm: row.atualizado_em != null ? String(row.atualizado_em) : null,
    atualizadoPor: row.atualizado_por != null ? String(row.atualizado_por) : null,
    deletado: Boolean(row.deletado),
  };
}

export function celulaToInsertPayload(celula: Celula): CelulaInsertPayload {
  return {
    grupo_id: celula.grupoId,
    nome: celula.nome,
    rede: celula.rede,
    dia_semana: celula.diaSemana,
    horario: celula.horario,
    local: celula.local,
    ativa: celula.ativa,
    criado_em: celula.criadoEm,
    criado_por: celula.criadoPor,
    deletado: celula.deletado,
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
