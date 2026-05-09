import type { Encontro } from "../domain/encontro";
import type { MembroEmAtencaoResult, Severidade } from "./atencao-dtos";
import { EncontroRepository } from "../infra/encontro.repository";
import { MembrosCelulaRepository } from "../infra/membros-celula.repository";
import type { AcompanhamentoPastoralRepository } from "../infra/acompanhamento-pastoral.repository";

const REGRAS = {
    critico: { faltasConsecutivas: 4, diasSemPastoreio: 90 },
    alerta: { faltasConsecutivas: 3, diasSemPastoreio: 60 },
    observacao: { faltasConsecutivas: 2, diasSemPastoreio: 30 },
    janelaEncontros: 6,
};

function calcularFaltasConsecutivas(
    encontrosOrdenados: Encontro[],
    membroId: number,
): number {
    let faltas = 0;
    for (let i = encontrosOrdenados.length - 1; i >= 0; i--) {
        const freqs = encontrosOrdenados[i].frequencia ?? [];
        const freq = freqs.find((f) => f.membro_id === membroId);
        if (!freq || (!freq.presente && !freq.justificado)) {
            faltas++;
        } else {
            break;
        }
    }
    return faltas;
}

function calcularSeveridade(
    faltasConsecutivas: number,
    diasSemPastoreio: number | null,
): Severidade | null {
    if (
        faltasConsecutivas >= REGRAS.critico.faltasConsecutivas ||
        (diasSemPastoreio != null && diasSemPastoreio >= REGRAS.critico.diasSemPastoreio)
    ) {
        return "critico";
    }
    if (
        faltasConsecutivas >= REGRAS.alerta.faltasConsecutivas ||
        (diasSemPastoreio != null && diasSemPastoreio >= REGRAS.alerta.diasSemPastoreio)
    ) {
        return "alerta";
    }
    if (
        faltasConsecutivas >= REGRAS.observacao.faltasConsecutivas ||
        (diasSemPastoreio != null && diasSemPastoreio >= REGRAS.observacao.diasSemPastoreio)
    ) {
        return "observacao";
    }
    return null;
}

function construirMotivos(faltasConsecutivas: number, diasSemPastoreio: number | null): string[] {
    const motivos: string[] = [];
    if (faltasConsecutivas > 0) {
        motivos.push(
            `${faltasConsecutivas} falta${faltasConsecutivas > 1 ? "s" : ""} não justificada${faltasConsecutivas > 1 ? "s" : ""} seguida${faltasConsecutivas > 1 ? "s" : ""}`,
        );
    }
    if (diasSemPastoreio != null && diasSemPastoreio > 0) {
        motivos.push(`Última ação registrada há ${diasSemPastoreio} dias`);
    }
    return motivos;
}

const SEVERIDADE_PESO: Record<Severidade, number> = {
    critico: 3,
    alerta: 2,
    observacao: 1,
};

export class AtencaoCelulaService {
    constructor(
        private readonly encontroRepo: EncontroRepository,
        private readonly membrosCelulaRepo: MembrosCelulaRepository,
        private readonly acompanhamentoRepo: AcompanhamentoPastoralRepository,
    ) {}

    async list(celulaId: number): Promise<MembroEmAtencaoResult[]> {
        const [encontros, membros] = await Promise.all([
            this.encontroRepo.findByCelulaId(celulaId),
            this.membrosCelulaRepo.findMembrosByCelulaId(celulaId),
        ]);

        const encontrosOrdenados = [...encontros]
            .sort((a, b) => a.data.localeCompare(b.data))
            .slice(-REGRAS.janelaEncontros);

        if (encontrosOrdenados.length === 0) return [];

        const membroIds = membros.map((m) => m.id);
        const ultimosAcompanhamentos = await this.acompanhamentoRepo
            .findUltimaDataPorMembros(membroIds);

        const agora = Date.now();
        const resultados: MembroEmAtencaoResult[] = [];

        for (const membro of membros) {
            const faltasConsecutivas = calcularFaltasConsecutivas(encontrosOrdenados, membro.id);

            const ultimaData = ultimosAcompanhamentos.get(membro.id);
            const diasSemPastoreio = ultimaData != null
                ? Math.floor((agora - new Date(ultimaData).getTime()) / (1000 * 60 * 60 * 24))
                : null;

            const severidade = calcularSeveridade(faltasConsecutivas, diasSemPastoreio);
            if (severidade == null) continue;

            const motivos = construirMotivos(faltasConsecutivas, diasSemPastoreio);

            resultados.push({
                id: String(membro.id),
                nome: membro.nome ?? "Sem nome",
                avatarUrl: membro.avatarUrl ?? undefined,
                severidade,
                motivos,
                diasSemContato: diasSemPastoreio ?? faltasConsecutivas * 7,
                telefone: membro.telefone ?? undefined,
            });
        }

        return resultados.sort(
            (a, b) => SEVERIDADE_PESO[b.severidade] - SEVERIDADE_PESO[a.severidade],
        );
    }
}
