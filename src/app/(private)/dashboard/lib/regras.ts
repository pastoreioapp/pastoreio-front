export const REGRAS_ATENCAO = {
    critico: { faltasConsecutivas: 3, diasSemPastoreio: 35 },
    alerta: { faltasConsecutivas: 2, diasSemPastoreio: 21 },
    observacao: { faltasConsecutivas: 1, diasSemPastoreio: 14 },
    janelaEncontros: 6,
};

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
