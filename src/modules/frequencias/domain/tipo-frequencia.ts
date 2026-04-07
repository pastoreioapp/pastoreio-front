export enum TipoFrequencia {
  CELULA = "CELULA",
  CURSO = "CURSO",
  ACOMPANHAMENTO_PASTORAL = "ACOMPANHAMENTO_PASTORAL",
}

export const TIPO_FREQUENCIA_LABEL: Record<TipoFrequencia, string> = {
  [TipoFrequencia.CELULA]: "Célula",
  [TipoFrequencia.CURSO]: "Curso",
  [TipoFrequencia.ACOMPANHAMENTO_PASTORAL]: "Acomp. Pastoral",
};

export const TIPO_FREQUENCIA_COR: Record<TipoFrequencia, string> = {
  [TipoFrequencia.CELULA]: "#5E79B3",
  [TipoFrequencia.CURSO]: "#E89B38",
  [TipoFrequencia.ACOMPANHAMENTO_PASTORAL]: "#6BAF7B",
};
