"use client";

import { Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { DashboardHeader } from "./DashboardHeader";
import { SaudeCelulaCard } from "./SaudeCelulaCard";
import { AcoesRapidasCard } from "./AcoesRapidasCard";
import { MetasCelulaCard, type MetaCelula } from "./MetasCelulaCard";
import { MembrosAtencaoCard } from "./MembrosAtencaoCard";
import type { MembroAtencao } from "./MembroAtencaoItem";
import { PulsoSemanaCard, type PulsoSemana } from "./PulsoSemanaCard";

const MEMBROS_ATENCAO_MOCK: MembroAtencao[] = [
    {
        id: "1",
        nome: "Ana Silva",
        severidade: "critico",
        diasSemContato: 41,
        motivos: [
            "3 faltas não justificadas seguidas",
            "Última ação registrada há 41 dias",
        ],
    },
    {
        id: "2",
        nome: "Carlos Souza",
        severidade: "alerta",
        diasSemContato: 20,
        motivos: [
            "3 faltas não justificadas seguidas",
            "Última ação registrada há 20 dias",
        ],
    },
    {
        id: "3",
        nome: "Marina Costa",
        severidade: "observacao",
        diasSemContato: 12,
        motivos: [
            "2 faltas não justificadas seguidas",
            "Última ação registrada há 12 dias",
        ],
    },
];

const METAS_MOCK: MetaCelula[] = [
    {
        id: "oferta",
        titulo: "Oferta",
        valorAtual: 500,
        valorMeta: 1000,
        formato: "moeda",
    },
    {
        id: "vidas",
        titulo: "Vidas ganhas para Cristo",
        valorAtual: 9,
        valorMeta: 10,
        unidade: "vidas",
    },
    {
        id: "casas",
        titulo: "Casas de PAZ",
        valorAtual: 4,
        valorMeta: 5,
        unidade: "casas",
    },
];

const PULSO_MOCK: PulsoSemana = {
    presencas: 18,
    justificados: 2,
    faltas: 3,
    tendencia: { direcao: "queda", label: "queda leve" },
    historicoFrequencia: [16, 19, 22, 21, 18],
};

const emBreve = () =>
    enqueueSnackbar("Funcionalidade disponível em breve!", {
        variant: "info",
        autoHideDuration: 2000,
    });

export function DashboardScreen() {
    return (
        <Box sx={{ pb: { xs: 3, md: 4 } }}>
            <DashboardHeader />

            <Box
                sx={{
                    display: "grid",
                    gap: { xs: 2, md: 3 },
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(0, 360px) minmax(0, 1fr) minmax(0, 1fr)",
                    },
                    gridTemplateRows: { md: "auto auto" },
                    gridTemplateAreas: {
                        xs: `
                            "atencao"
                            "acoes"
                            "pulso"
                            "metas"
                            "saude"
                        `,
                        md: `
                            "saude atencao atencao"
                            "acoes metas pulso"
                        `,
                    },
                }}
            >
                <Box sx={{ gridArea: "saude" }}>
                    <SaudeCelulaCard
                        titulo="Saúde da célula"
                        mensagem="Sua célula está florescendo, parabéns!"
                        versiculo={
                            "\u201CAquele que permanece em Mim e Eu nele, esse dá muito fruto...\u201D João 15:5"
                        }
                        score={85}
                        onVerDetalhes={emBreve}
                    />
                </Box>

                <Box sx={{ gridArea: "atencao" }}>
                    <MembrosAtencaoCard
                        membros={MEMBROS_ATENCAO_MOCK}
                        onVerFicha={emBreve}
                        onEnviarMensagem={emBreve}
                        onRegistrarPastoreio={emBreve}
                        onMarcarAcompanhado={emBreve}
                        onAdiar={emBreve}
                    />
                </Box>

                <Box sx={{ gridArea: "acoes" }}>
                    <AcoesRapidasCard
                        onLancarFrequencia={emBreve}
                        onRegistrarVisitante={emBreve}
                        onCadastrarMembro={emBreve}
                    />
                </Box>

                <Box sx={{ gridArea: "metas" }}>
                    <MetasCelulaCard metas={METAS_MOCK} />
                </Box>

                <Box sx={{ gridArea: "pulso" }}>
                    <PulsoSemanaCard pulso={PULSO_MOCK} onVerDetalhes={emBreve} />
                </Box>
            </Box>
        </Box>
    );
}
