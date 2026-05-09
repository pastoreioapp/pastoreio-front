"use client";

import { Box, Button, Typography } from "@mui/material";
import { IconCalendarCheck, IconUserPlus } from "@tabler/icons-react";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { BRAND, BRAND_HOVER, FOCUS_OUTLINE } from "../lib/tokens";

function getSaudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

function getDataExtenso(): string {
    return new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

type Props = {
    onLancarFrequencia?: () => void;
    onRegistrarMembro?: () => void;
};

export function DashboardHeader({
    onLancarFrequencia,
    onRegistrarMembro,
}: Props) {
    const { loggedUser } = useAppAuthentication();
    const primeiroNome = loggedUser?.nome ?? "";
    const saudacao = getSaudacao();
    const data = getDataExtenso();

    const buttonBaseSx = {
        textTransform: "none" as const,
        fontWeight: 700,
        fontSize: "0.85rem",
        py: 0.85,
        px: 2,
        borderRadius: 2,
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        flex: { xs: 1, sm: "0 0 auto" },
        whiteSpace: "normal" as const,
        lineHeight: 1.2,
        textAlign: "center" as const,
        minWidth: 0,
        "& .MuiButton-startIcon": {
            alignSelf: "center",
        },
        ...FOCUS_OUTLINE,
    };

    return (
        <Box
            component="header"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 1 },
                mb: 3,
            }}
        >
            <Box>
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: "1.4rem", md: "1.6rem" },
                        fontWeight: 700,
                        color: "#2F323A",
                        lineHeight: 1.3,
                    }}
                >
                    {saudacao}
                    {primeiroNome ? `, ${primeiroNome}` : ""}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "0.85rem",
                        color: "text.secondary",
                        mt: 0.25,
                    }}
                >
                    Aqui está o panorama da sua célula hoje, {data}.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                    width: { xs: "100%", sm: "auto" },
                }}
            >
                <Button
                    variant="contained"
                    onClick={onLancarFrequencia}
                    startIcon={<IconCalendarCheck size={16} />}
                    sx={{
                        ...buttonBaseSx,
                        bgcolor: BRAND,
                        color: "#fff",
                        "&:hover": {
                            bgcolor: BRAND_HOVER,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        },
                    }}
                >
                    Lançar frequência
                </Button>
                <Button
                    variant="outlined"
                    onClick={onRegistrarMembro}
                    aria-label="Registrar membro ou visitante"
                    startIcon={<IconUserPlus size={16} />}
                    sx={{
                        ...buttonBaseSx,
                        bgcolor: "#fff",
                        color: BRAND,
                        borderColor: "rgba(94, 121, 179, 0.25)",
                        "&:hover": {
                            borderColor: BRAND,
                            bgcolor: "rgba(94, 121, 179, 0.06)",
                        },
                    }}
                >
                    Novo membro
                </Button>
            </Box>
        </Box>
    );
}
