import type { PulsoSemanaResult } from "./dashboard-dtos";
import type { MembroEmAtencaoResult } from "./atencao-dtos";
import type { MetaCelulaDto } from "@/modules/metas/application/dtos";

export const PESOS_SAUDE = {
    presenca: 0.5,
    pastoreio: 0.3,
    metas: 0.2,
} as const;

export type StatusPilar = "bom" | "atencao" | "ruim";

export interface PilarSaude {
    score: number;
    status: StatusPilar;
    peso: number;
    detalhe: { numerador: number; denominador: number };
}

export interface PilaresSaude {
    presenca: PilarSaude;
    pastoreio: PilarSaude;
    metas: PilarSaude;
    scoreFinal: number;
}

export function statusPorScore(score: number): StatusPilar {
    if (score >= 85) return "bom";
    if (score >= 60) return "atencao";
    return "ruim";
}

export function calcularPresenca(pulso: PulsoSemanaResult): PilarSaude {
    const denominador = pulso.presencas + pulso.justificados + pulso.faltas;
    const numerador = pulso.presencas;
    const score = denominador > 0 ? (numerador / denominador) * 100 : 100;

    return {
        score,
        status: statusPorScore(score),
        peso: PESOS_SAUDE.presenca,
        detalhe: { numerador, denominador },
    };
}

export function calcularPastoreio(
    membrosAtencao: MembroEmAtencaoResult[],
    totalMembros: number,
): PilarSaude {
    const denominador = totalMembros > 0 ? totalMembros : 1;
    const criticos = membrosAtencao.filter((m) => m.severidade === "critico").length;
    const numerador = denominador - criticos;
    const score = (numerador / denominador) * 100;

    return {
        score,
        status: statusPorScore(score),
        peso: PESOS_SAUDE.pastoreio,
        detalhe: { numerador: criticos, denominador },
    };
}

export function calcularMetas(metas: MetaCelulaDto[]): PilarSaude {
    if (metas.length === 0) {
        return {
            score: 100,
            status: statusPorScore(100),
            peso: PESOS_SAUDE.metas,
            detalhe: { numerador: 0, denominador: 0 },
        };
    }

    const progressos = metas.map((m) =>
        m.valorMeta > 0 ? Math.min((m.valorAtual / m.valorMeta) * 100, 100) : 100,
    );
    const score = progressos.reduce((s, v) => s + v, 0) / progressos.length;

    return {
        score,
        status: statusPorScore(score),
        peso: PESOS_SAUDE.metas,
        detalhe: { numerador: Math.round(score), denominador: 100 },
    };
}

export function calcularPilares(
    pulso: PulsoSemanaResult,
    membrosAtencao: MembroEmAtencaoResult[],
    metas: MetaCelulaDto[],
): PilaresSaude {
    const presenca = calcularPresenca(pulso);
    const totalFreq = pulso.presencas + pulso.justificados + pulso.faltas;
    const totalMembros = totalFreq > 0 ? totalFreq : 1;
    const pastoreio = calcularPastoreio(membrosAtencao, totalMembros);
    const metasPilar = calcularMetas(metas);

    const scoreFinal = Math.round(
        presenca.score * PESOS_SAUDE.presenca +
        pastoreio.score * PESOS_SAUDE.pastoreio +
        metasPilar.score * PESOS_SAUDE.metas,
    );

    return {
        presenca,
        pastoreio,
        metas: metasPilar,
        scoreFinal,
    };
}
