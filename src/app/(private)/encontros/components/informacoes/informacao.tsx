"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { IconArrowLeft, IconPencil } from "@tabler/icons-react";
import { InformacoesGroup } from "./informacoesGroup";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import { EtapasTabs } from "./etapasTabs";
import { enqueueSnackbar } from "notistack";

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

export function Informacao({
    data,
    onBack,
}: {
    data: Encontro | null;
    onBack?: () => void;
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
                border: "1px solid #F5F5F5",
                p: { xs: 3, md: 5 },
                borderRadius: "10px",
                width: "100%",
                height: "100%",
            }}
        >
            {onBack && (
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            onClick={onBack}
                            sx={{
                                color: "#5E79B3",
                                "&:hover": { bgcolor: "rgba(94, 121, 179, 0.08)" },
                            }}
                        >
                            <IconArrowLeft size={24} />
                        </IconButton>
                        <Typography
                            sx={{
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: "#5E79B3",
                                cursor: "pointer",
                            }}
                            onClick={onBack}
                        >
                            Voltar para lista
                        </Typography>
                    </Box>

                    <Typography
                        onClick={() => enqueueSnackbar("Funcionalidade disponível em breve!", { variant: "info", autoHideDuration: 2000 })}
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#5E79B3",
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "color 0.2s, text-decoration 0.2s",
                            "&:hover": {
                                color: "#405687",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <IconPencil size={20} />
                        Editar
                    </Typography>
                </Box>
            )}

            <Box
                sx={{
                    pt: "22px",
                    pr: "22px",
                    pl: { xs: "22px", md: "46px" },
                    display: "flex",
                    flexDirection: "column",
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
                    <Box sx={{ my: 2 }}>
                        <Typography fontSize={18} fontWeight={500}>
                            Tema: {data.tema}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: "flex",
                        mt: 2,
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 0, md: 5 },
                        flex: { md: 1 },
                        minWidth: 0,
                        width: "100%",
                    }}>
                        {grupos.map((grupo, i) => (
                            <Box key={i} sx={{ flex: { md: 1 }, minWidth: 0, width: "100%" }}>
                                <InformacoesGroup
                                    titulo={grupo.titulo}
                                    campos={grupo.campos}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        justifyContent: "end",
                        alignItems: "start",
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                >
                    <Typography
                        onClick={() => enqueueSnackbar("Funcionalidade disponível em breve!", { variant: "info", autoHideDuration: 2000 })}
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#5E79B3",
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "color 0.2s, text-decoration 0.2s",
                            "&:hover": {
                                color: "#405687",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <IconPencil size={20} />
                        Editar
                    </Typography>
                </Box>
            </Box>

            <EtapasTabs data={data.frequencia} />
        </Box>
    );
}
