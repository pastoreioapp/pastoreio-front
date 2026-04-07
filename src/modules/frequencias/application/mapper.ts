import {
  TipoFrequencia,
  TIPO_FREQUENCIA_LABEL,
  TIPO_FREQUENCIA_COR,
} from "../domain/tipo-frequencia";
import type {
  FrequenciaCelulaRow,
  FrequenciaCursoRow,
  AcompanhamentoPastoralRow,
} from "../infra/mapper";
import type { FrequenciaDoMembroDto } from "./dtos";

export function toFrequenciasCelula(rows: FrequenciaCelulaRow[]): FrequenciaDoMembroDto[] {
  return rows.map((row) => ({
    id: `${TipoFrequencia.CELULA}-${row.id}`,
    data: row.encontros.data,
    tipo: TipoFrequencia.CELULA,
    tipoLabel: TIPO_FREQUENCIA_LABEL[TipoFrequencia.CELULA],
    cor: TIPO_FREQUENCIA_COR[TipoFrequencia.CELULA],
    presente: row.presente,
    titulo: row.encontros.tema,
    descricao: row.justificativa,
  }));
}

export function toFrequenciasCurso(rows: FrequenciaCursoRow[]): FrequenciaDoMembroDto[] {
  return rows.map((row) => ({
    id: `${TipoFrequencia.CURSO}-${row.id}`,
    data: row.aulas.data,
    tipo: TipoFrequencia.CURSO,
    tipoLabel: TIPO_FREQUENCIA_LABEL[TipoFrequencia.CURSO],
    cor: TIPO_FREQUENCIA_COR[TipoFrequencia.CURSO],
    presente: row.presente,
    titulo: row.aulas.tema ?? "Aula",
    descricao: row.justificativa,
  }));
}

export function toAcompanhamentosPastorais(rows: AcompanhamentoPastoralRow[]): FrequenciaDoMembroDto[] {
  return rows.map((row) => ({
    id: `${TipoFrequencia.ACOMPANHAMENTO_PASTORAL}-${row.acompanhamentos_pastorais.id}`,
    data: row.acompanhamentos_pastorais.data,
    tipo: TipoFrequencia.ACOMPANHAMENTO_PASTORAL,
    tipoLabel: TIPO_FREQUENCIA_LABEL[TipoFrequencia.ACOMPANHAMENTO_PASTORAL],
    cor: TIPO_FREQUENCIA_COR[TipoFrequencia.ACOMPANHAMENTO_PASTORAL],
    presente: true,
    titulo: row.acompanhamentos_pastorais.tipo ?? "Acompanhamento",
    descricao: row.acompanhamentos_pastorais.observacoes,
  }));
}
