"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { IconArrowLeft, IconPencil } from "@tabler/icons-react";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";
import { InformacaoHeader } from "./informacoesHeader";
import { InformacoesGroup } from "./informacoesGroup";
import { EtapasTabs } from "./etapasTabs";

const MensagemNenhumMembroSelecionado = () => (
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
            Selecione um membro para visualizar suas informações
        </Typography>
    </Box>
);

export function Informacao({
    data,
    onBack,
}: {
    data: MembroListItemDto | null;
    onBack?: () => void;
}) {

    if (!data) return <MensagemNenhumMembroSelecionado />;

    const grupos = [
        {
            titulo: "Dados Pessoais",
            campos: [
                { label: "Telefone", valor: data.telefone },
                { label: "Email", valor: data.email },
                { label: "Nascimento", valor: data.dataNascimento },
                { label: "Endereço", valor: data.endereco },
            ],
        },
        {
            titulo: "Dados Familiares",
            campos: [
                { label: "Estado Civil", valor: data.estadoCivil },
                { label: "Cônjuge", valor: data.conjuge },
                { label: "Filhos", valor: data.filhos },
            ],
        },
        {
            titulo: "Dados Ministeriais",
            campos: [
                { label: "Discípulo de", valor: data.discipulador },
                { label: "Discipulando", valor: data.discipulando },
                { label: "Ministério", valor: data.ministerio },
            ],
        },
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
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
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
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "center", md: "flex-start" },
                }}
            >
                <InformacaoHeader nome={data.nome} funcao={data.funcao} />

                <Box sx={{
                    display: "flex",
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

                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        justifyContent: "end",
                        alignItems: "start",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#5E79B3",
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            cursor: "pointer",
                            mr: -7,
                            mt: -2,
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

            <EtapasTabs />
        </Box>
    );
}
