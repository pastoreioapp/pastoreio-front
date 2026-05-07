import type { SaudeCelulaResult } from "./saude-dtos";
import type { PulsoCelulaService } from "./pulso-celula.service";
import type { AtencaoCelulaService } from "./atencao-celula.service";
import type { MetasCelulaService } from "@/modules/metas/application/metas-celula.service";

const PESOS = {
    presenca: 0.5,
    pastoreio: 0.3,
    metas: 0.2,
};

const FAIXAS: { min: number; label: string; classe: SaudeCelulaResult["classe"] }[] = [
    { min: 85, label: "Sua célula está florescendo, parabéns!", classe: "florescendo" },
    { min: 70, label: "Sua célula está saudável", classe: "saudavel" },
    { min: 50, label: "Sua célula precisa de atenção", classe: "atencao" },
    { min: 0, label: "Sua célula precisa de cuidado urgente", classe: "critica" },
];

export class SaudeCelulaService {
    constructor(
        private readonly pulsoService: PulsoCelulaService,
        private readonly atencaoService: AtencaoCelulaService,
        private readonly metasService: MetasCelulaService,
    ) {}

    async get(celulaId: number, versiculo: string): Promise<SaudeCelulaResult> {
        const [pulso, membrosAtencao, metas] = await Promise.all([
            this.pulsoService.get(celulaId),
            this.atencaoService.list(celulaId),
            this.metasService.list(celulaId),
        ]);

        const totalFreq = pulso.presencas + pulso.justificados + pulso.faltas;
        const taxaPresenca = totalFreq > 0 ? (pulso.presencas / totalFreq) * 100 : 100;

        const totalMembros = totalFreq > 0 ? totalFreq : 1;
        const criticos = membrosAtencao.filter((m) => m.severidade === "critico").length;
        const taxaSemCritico = ((totalMembros - criticos) / totalMembros) * 100;

        let progressoMetas = 100;
        if (metas.length > 0) {
            const progressos = metas.map((m) =>
                m.valorMeta > 0 ? Math.min((m.valorAtual / m.valorMeta) * 100, 100) : 100,
            );
            progressoMetas = progressos.reduce((s, v) => s + v, 0) / progressos.length;
        }

        const score = Math.round(
            taxaPresenca * PESOS.presenca +
            taxaSemCritico * PESOS.pastoreio +
            progressoMetas * PESOS.metas,
        );

        const faixa = FAIXAS.find((f) => score >= f.min) ?? FAIXAS[FAIXAS.length - 1];

        return {
            score,
            mensagem: faixa.label,
            versiculo,
            classe: faixa.classe,
        };
    }
}
