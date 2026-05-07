export const REGRAS_ATENCAO = {
    critico: { faltasConsecutivas: 3, diasSemPastoreio: 35 },
    alerta: { faltasConsecutivas: 2, diasSemPastoreio: 21 },
    observacao: { faltasConsecutivas: 1, diasSemPastoreio: 14 },
    janelaEncontros: 6,
};

export const TENDENCIA_LABELS: Record<string, string> = {
    "subida-forte": "subida forte",
    "subida-leve": "subida leve",
    "estavel": "estável",
    "queda-leve": "queda leve",
    "queda-forte": "queda forte",
};

export function calcularLabelTendencia(deltaPct: number): {
    direcao: "subida" | "queda" | "estavel";
    label: string;
    deltaPct: number;
} {
    if (deltaPct >= 15) return { direcao: "subida", label: TENDENCIA_LABELS["subida-forte"], deltaPct };
    if (deltaPct >= 5) return { direcao: "subida", label: TENDENCIA_LABELS["subida-leve"], deltaPct };
    if (deltaPct <= -15) return { direcao: "queda", label: TENDENCIA_LABELS["queda-forte"], deltaPct };
    if (deltaPct <= -5) return { direcao: "queda", label: TENDENCIA_LABELS["queda-leve"], deltaPct };
    return { direcao: "estavel", label: TENDENCIA_LABELS["estavel"], deltaPct };
}

export const PESOS_SAUDE = {
    presenca: 0.5,
    pastoreio: 0.3,
    metas: 0.2,
};

export const FAIXAS_SAUDE = [
    { min: 85, label: "Sua célula está florescendo, parabéns!", classe: "florescendo" as const },
    { min: 70, label: "Sua célula está saudável", classe: "saudavel" as const },
    { min: 50, label: "Sua célula precisa de atenção", classe: "atencao" as const },
    { min: 0, label: "Sua célula precisa de cuidado urgente", classe: "critica" as const },
];
