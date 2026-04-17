"use client";

import { Box, Typography } from "@mui/material";
import { IconRefresh } from "@tabler/icons-react";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";

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

export function DashboardHeader() {
    const { loggedUser } = useAppAuthentication();
    const primeiroNome = loggedUser?.nome ?? "";
    const saudacao = getSaudacao();
    const data = getDataExtenso();

    return (
        <Box
            component="header"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
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
                    gap: 0.5,
                    color: "text.secondary",
                    flexShrink: 0,
                }}
            >
                <IconRefresh size={14} stroke={1.8} />
                <Typography sx={{ fontSize: "0.75rem" }}>
                    Atualizado há poucos minutos
                </Typography>
            </Box>
        </Box>
    );
}
