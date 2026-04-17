"use client";

import { useEffect, useState } from "react";
import { Box, Chip, LinearProgress, Typography } from "@mui/material";
import { CARD_STYLE, SUCCESS, WARNING, DANGER } from "../lib/tokens";

export type MetaCelula = {
    id: string;
    titulo: string;
    valorAtual: number;
    valorMeta: number;
    unidade?: string;
    formato?: "moeda" | "numero";
};

type Props = {
    metas: MetaCelula[];
    periodo?: string;
};

function getCorMeta(progresso: number): string {
    if (progresso >= 80) return SUCCESS;
    if (progresso >= 50) return WARNING;
    return DANGER;
}

function formatarValor(valor: number, formato?: "moeda" | "numero", unidade?: string): string {
    if (formato === "moeda") {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
    const num = valor.toLocaleString("pt-BR");
    return unidade ? `${num} ${unidade}` : num;
}

function MetaItem({ meta }: { meta: MetaCelula }) {
    const [animado, setAnimado] = useState(0);
    const progresso = meta.valorMeta > 0
        ? Math.min(Math.round((meta.valorAtual / meta.valorMeta) * 100), 100)
        : 0;
    const cor = getCorMeta(progresso);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setAnimado(progresso));
        return () => cancelAnimationFrame(raf);
    }, [progresso]);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                }}
            >
                <Typography
                    sx={{ fontSize: "0.85rem", color: "#3F3F3F", fontWeight: 500 }}
                >
                    {meta.titulo}
                </Typography>
                <Typography
                    sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#5C5F68" }}
                >
                    {formatarValor(meta.valorAtual, meta.formato, meta.unidade)}
                    {" / "}
                    {formatarValor(meta.valorMeta, meta.formato, meta.unidade)}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={animado}
                sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "#EEF1F4",
                    transition: "none",
                    "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        bgcolor: cor,
                        transition: "transform 600ms ease-out",
                    },
                }}
            />
            <Typography
                sx={{ fontSize: "0.7rem", color: "text.secondary", mt: 0.5 }}
            >
                {progresso}% concluído
            </Typography>
        </Box>
    );
}

export function MetasCelulaCard({ metas, periodo = "Mês atual" }: Props) {
    const headerId = "metas-celula-titulo";

    return (
        <Box
            component="section"
            aria-labelledby={headerId}
            sx={{
                ...CARD_STYLE,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Typography
                    id={headerId}
                    component="h2"
                    sx={{
                        fontSize: { xs: "1.05rem", md: "1.2rem" },
                        fontWeight: 600,
                        color: "#2F323A",
                    }}
                >
                    Metas da célula
                </Typography>
                <Chip
                    label={periodo}
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        bgcolor: "rgba(94, 121, 179, 0.1)",
                        color: "#5E79B3",
                        borderRadius: 1.5,
                    }}
                />
            </Box>

            <Box
                component="ul"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    m: 0,
                    p: 0,
                    listStyle: "none",
                }}
            >
                {metas.map((meta) => (
                    <Box component="li" key={meta.id} sx={{ listStyle: "none" }}>
                        <MetaItem meta={meta} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
