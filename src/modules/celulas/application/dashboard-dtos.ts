export interface HistoricoEncontroDto {
    data: string;
    presencas: number;
}

export interface PulsoSemanaResult {
    presencas: number;
    justificados: number;
    faltas: number;
    tendencia: { direcao: "subida" | "queda" | "estavel"; label: string; deltaPct: number };
    historico: HistoricoEncontroDto[];
    ultimoEncontroData: string | null;
}
