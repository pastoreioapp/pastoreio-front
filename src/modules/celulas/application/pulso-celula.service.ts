import type { PulsoSemanaResult } from "./dashboard-dtos";
import { EncontroRepository } from "../infra/encontro.repository";

const QTD_ENCONTROS_HISTORICO = 5;

function calcularTendencia(historicoPresencas: number[]): {
    direcao: "subida" | "queda" | "estavel";
    label: string;
    deltaPct: number;
} {
    if (historicoPresencas.length < 3) {
        return { direcao: "estavel", label: "estável", deltaPct: 0 };
    }

    const recentes = historicoPresencas.slice(-2);
    const anteriores = historicoPresencas.slice(0, -2);

    const mediaRecentes = recentes.reduce((s, v) => s + v, 0) / recentes.length;
    const mediaAnteriores = anteriores.reduce((s, v) => s + v, 0) / anteriores.length;

    if (mediaAnteriores === 0) {
        return mediaRecentes > 0
            ? { direcao: "subida", label: "subida forte", deltaPct: 100 }
            : { direcao: "estavel", label: "estável", deltaPct: 0 };
    }

    const deltaPct = Math.round(((mediaRecentes - mediaAnteriores) / mediaAnteriores) * 100);

    if (deltaPct >= 15) return { direcao: "subida", label: "subida forte", deltaPct };
    if (deltaPct >= 5) return { direcao: "subida", label: "subida leve", deltaPct };
    if (deltaPct <= -15) return { direcao: "queda", label: "queda forte", deltaPct };
    if (deltaPct <= -5) return { direcao: "queda", label: "queda leve", deltaPct };
    return { direcao: "estavel", label: "estável", deltaPct };
}

export class PulsoCelulaService {
    constructor(private readonly encontroRepo: EncontroRepository) {}

    async get(celulaId: number): Promise<PulsoSemanaResult> {
        const encontros = await this.encontroRepo.findByCelulaId(celulaId);

        if (encontros.length === 0) {
            return {
                presencas: 0,
                justificados: 0,
                faltas: 0,
                // TODO: usar enum para direcao e label
                tendencia: { direcao: "estavel", label: "estável", deltaPct: 0 },
                historico: [],
                ultimoEncontroData: null,
            };
        }

        const ordenados = [...encontros]
            .sort((a, b) => a.data.localeCompare(b.data))
            .slice(-QTD_ENCONTROS_HISTORICO);

        const ultimoEncontro = ordenados[ordenados.length - 1];
        const freqsUltimo = ultimoEncontro.frequencia ?? [];

        const presencas = freqsUltimo.filter((f) => f.presente).length;
        const justificados = freqsUltimo.filter((f) => !f.presente && f.justificado).length;
        const faltas = freqsUltimo.filter((f) => !f.presente && !f.justificado).length;
        console.log("freqsUltimo", freqsUltimo);
        console.log("presencas", presencas);
        console.log("justificados", justificados);
        console.log("faltas", faltas);

        const historico = ordenados.map((enc) => ({
            data: enc.data,
            presencas: (enc.frequencia ?? []).filter((f) => f.presente).length,
        }));

        const tendencia = calcularTendencia(historico.map((h) => h.presencas));

        return {
            presencas,
            justificados,
            faltas,
            tendencia,
            historico,
            ultimoEncontroData: ultimoEncontro.data,
        };
    }
}
