"use client";

import { Box, Typography } from "@mui/material";
import { IconPencil } from "@tabler/icons-react";
import { InformacoesGroup } from "./informacoesGroup";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import { EtapasTabs } from "./etapasTabs";

const MensagemNenhumEncontroSelecionado = () => (
    <Box
        sx={{
            border: "1px solid #F5F5F5",
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Typography sx={{ color: "#999", fontSize: "16px" }}>
            Selecione um encontro para visualizar suas informações
        </Typography>
    </Box>
);

export function Informacao({ data }: { data: Encontro | null }) {
    if (!data) return <MensagemNenhumEncontroSelecionado />;

    const grupos = [
        {
            campos: [
                {
                    label: "Data",
                    valor: new Date(data.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
                },
                { label: "Anfitrião", valor: data.anfitriao },
                {
                    label: "Número de participantes",
                    valor: data.numeroParticipantes,
                },
            ],
        },
        {
            campos: [
                {
                    label: "Preletor (quem levou a palavra)",
                    valor: data.preletor,
                },
                { label: "Houve supervisão do setor", valor: data.supervisao },
                { label: "Houve conversões", valor: data.conversoes },
            ],
        },
    ];

    return (
        <Box
            sx={{
                border: "1px solid #F5F5F5",
                borderRadius: "10px",
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    pt: "22px",
                    pr: "22px",
                    pl: "46px",
                    display: "flex",
                    gap: "11px",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ pt: "16px" }}>
                        <Typography fontSize={18} fontWeight={500}>
                            Tema: {data.tema}
                        </Typography>
                    </Box>

                    <Box sx={{ pt: "11px", display: "flex", gap: "66px" }}>
                        {grupos.map((grupo, i) => (
                            <Box key={i}>
                                <InformacoesGroup campos={grupo.campos} />
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "start",
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#5E79B3",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <IconPencil size={14} />
                        Editar
                    </Typography>
                </Box>
            </Box>

            <EtapasTabs data={data.frequencia} />
        </Box>
    );
}
