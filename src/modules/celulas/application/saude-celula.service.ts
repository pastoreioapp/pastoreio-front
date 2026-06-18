import type { SaudeCelulaResult } from "./saude-dtos";
import type { PulsoCelulaService } from "./pulso-celula.service";
import type { AtencaoCelulaService } from "./atencao-celula.service";
import type { MetasCelulaService } from "@/modules/metas/application/metas-celula.service";
import { calcularPilares } from "./saude-celula.calc";

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

        const { scoreFinal } = calcularPilares(pulso, membrosAtencao, metas);
        const faixa = FAIXAS.find((f) => scoreFinal >= f.min) ?? FAIXAS[FAIXAS.length - 1];

        return {
            score: scoreFinal,
            mensagem: faixa.label,
            versiculo,
            classe: faixa.classe,
        };
    }
}
