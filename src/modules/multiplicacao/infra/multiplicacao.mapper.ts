import { parsePapelCelula } from "@/modules/celulas/domain/papel-celula";
import type {
  MultiplicacaoListItemDto,
  MultiplicacaoMembroListItemDto,
} from "../application/dtos";
import { parseStatusMultiplicacao } from "../domain/status-multiplicacao";
import type { MultiplicacaoMembroRow, MultiplicacaoRow } from "./multiplicacao.types";

export function rowToMultiplicacaoMembroListItemDto(
  row: MultiplicacaoMembroRow,
): MultiplicacaoMembroListItemDto {
  return {
    id: row.id,
    membroId: row.membro_id,
    nome: row.membros?.nome ?? null,
    papelCelula: parsePapelCelula(row.papel_celula),
    liderNovaCelula: row.lider_nova_celula === true,
    observacoes: row.observacoes,
  };
}

export function rowToMultiplicacaoListItemDto(
  row: MultiplicacaoRow,
): MultiplicacaoListItemDto {
  const membros = (row.multiplicacao_membros ?? [])
    .filter((membro) => !membro.deletado)
    .map(rowToMultiplicacaoMembroListItemDto);

  return {
    id: row.id,
    celulaOrigemId: row.celula_origem_id,
    celulaDestinoId: row.celula_destino_id,
    celulaDestinoNome: row.celula_destino?.nome ?? null,
    liderMembroId: row.lider_membro_id,
    liderNome:
      membros.find((membro) => membro.membroId === row.lider_membro_id)?.nome ?? null,
    dataMultiplicacao: row.data_multiplicacao,
    statusMultiplicacao: parseStatusMultiplicacao(row.status_multiplicacao),
    observacoes: row.observacoes,
    criadoEm: row.criado_em,
    totalMembros: membros.length,
    membros,
  };
}
