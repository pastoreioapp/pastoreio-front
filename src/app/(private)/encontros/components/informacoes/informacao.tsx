"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { IconArrowLeft, IconCalendarEvent, IconPencil } from "@tabler/icons-react";
import { InformacoesGroup } from "./informacoesGroup";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import { EtapasTabs } from "./etapasTabs";

const MensagemNenhumEncontroSelecionado = () => (
    <Box
        sx={{
            border: "2px dashed #DEE3EA",
            width: "100%",
            height: "100%",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
        }}
    >
        <IconCalendarEvent size={48} stroke={1.5} color="#5A6A85" />
        <Typography sx={{ color: "text.secondary", fontSize: "16px" }}>
            Selecione um encontro para visualizar suas informações
        </Typography>
    </Box>
);

export function Informacao({
    data,
    onBack,
    onEditar,
}: {
    data: Encontro | null;
    onBack?: () => void;
    onEditar?: () => void;
}) {
    if (!data) return <MensagemNenhumEncontroSelecionado />;

    const numeroParticipantes = data.frequencia?.filter(frequencia => frequencia.presente).length;

    const grupos = [
        {
            titulo: "Dados do Encontro",
            campos: [
                { label: "Preletor", valor: data.preletor },
                { label: "Anfitrião", valor: data.anfitriao },
                { label: "Observações", valor: data.observacoes ?? "" },
            ],
        },
        {
            titulo: "Dados do Encontro",
            campos: [
                { 
                    label: "Data",
                    valor: new Date(data.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
                },
                { label: "Local", valor: data.local },
            ],
        },
        {
            titulo: "Estatísticas",
            campos: [
                { label: "Número de participantes", valor: numeroParticipantes ?? 0 },
                { label: "Houve supervisão do setor", valor: data.supervisao },
                { label: "Houve conversões", valor: data.conversoes },
            ]
        }
    ];

    return (
        <Box
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.04)",
                bgcolor: "#fff",
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    height: { xs: 50, md: 60 },
                    background: "linear-gradient(135deg, #4A6499 0%, #5E79B3 40%, #7B95CC 100%)",
                    position: "relative",
                }}
            >
                {onBack && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 10,
                            left: 12,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            onClick={onBack}
                            sx={{
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                            }}
                        >
                            <IconArrowLeft size={22} />
                        </IconButton>
                        <Typography
                            sx={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.9)",
                                cursor: "pointer",
                            }}
                            onClick={onBack}
                        >
                            Voltar
                        </Typography>
                    </Box>
                )}
                <IconButton
                    onClick={onEditar}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 12,
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                    }}
                >
                    <IconPencil size={20} />
                </IconButton>
            </Box>

            <Box sx={{ px: { xs: 3, md: 5 }, pb: { xs: 3, md: 5 } }}>
                <Typography fontSize={20} fontWeight={500} sx={{ pt: 4, mb: 4 }}>
                    Tema: {data.tema}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    {grupos.map((grupo, i) => (
                        <Box key={i} sx={{ flex: "1 1 220px", minWidth: 0 }}>
                            <InformacoesGroup
                                titulo={grupo.titulo}
                                campos={grupo.campos}
                            />
                        </Box>
                    ))}
                </Box>

                <EtapasTabs data={data.frequencia} />
            </Box>
        </Box>
    );
}
