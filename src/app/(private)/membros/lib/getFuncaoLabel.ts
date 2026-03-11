import { PapelCelula } from "@/modules/celulas/domain/papel-celula";

const FUNCAO_LABELS: Record<PapelCelula, string> = {
    [PapelCelula.LIDER_CELULA]: "Líder de Célula",
    [PapelCelula.AUXILIAR_CELULA]: "Auxiliar",
    [PapelCelula.MEMBRO]: "Membro",
    [PapelCelula.VISITANTE]: "Visitante",
};

const FUNCAO_CORES: Record<PapelCelula, { bgcolor: string; color: string }> = {
    [PapelCelula.LIDER_CELULA]: { bgcolor: "#5E79B3", color: "#fff" },
    [PapelCelula.AUXILIAR_CELULA]: { bgcolor: "#5E79B3", color: "#fff" },
    [PapelCelula.MEMBRO]: { bgcolor: "#DCE8E6", color: "#1B212D" },
    [PapelCelula.VISITANTE]: { bgcolor: "#FFE0B2", color: "#7A4B00" },
};

const CORES_FALLBACK = { bgcolor: "#DCE8E6", color: "#1B212D" } as const;

export function getFuncaoCores(
    funcao: PapelCelula | null | undefined
): { bgcolor: string; color: string } {
    if (!funcao) return CORES_FALLBACK;
    return FUNCAO_CORES[funcao] ?? CORES_FALLBACK;
}

export function getFuncaoLabel(funcao: PapelCelula | null | undefined): string {
    if (!funcao) {
        return "Desconhecido";
    }

    return FUNCAO_LABELS[funcao] ?? "Desconhecido";
}
