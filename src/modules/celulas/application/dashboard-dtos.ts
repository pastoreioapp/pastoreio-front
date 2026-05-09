export type TendenciaDirecao = "subida" | "queda" | "estavel";
export type IntensidadeTendencia = "forte" | "leve" | "neutra";

export interface Tendencia {
    direcao: TendenciaDirecao;
    intensidade: IntensidadeTendencia;
    deltaPct: number;
}

export interface HistoricoEncontroDto {
    data: string;
    presencas: number;
}

export interface PulsoSemanaResult {
    presencas: number;
    justificados: number;
    faltas: number;
    tendencia: Tendencia;
    historico: HistoricoEncontroDto[];
    ultimoEncontroData: string | null;
}
