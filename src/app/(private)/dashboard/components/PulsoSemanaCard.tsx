"use client";

import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import type {
    PulsoSemanaResult,
    TendenciaDirecao,
} from "@/modules/celulas/application/dashboard-dtos";
import { BRAND, BRAND_HOVER, CARD_STYLE, DANGER, SUCCESS, WARNING, FOCUS_OUTLINE } from "../lib/tokens";
import { rotularTendencia } from "../lib/tendencia-labels";
import { MiniChart } from "./MiniChart";

type Props = {
    pulso: PulsoSemanaResult;
    onVerDetalhes?: () => void;
};

const TENDENCIA_CORES: Record<TendenciaDirecao, string> = {
    subida: SUCCESS,
    queda: DANGER,
    estavel: "#5C5F68",
};

const TENDENCIA_BG: Record<TendenciaDirecao, string> = {
    subida: `${SUCCESS}14`,
    queda: `${DANGER}14`,
    estavel: "rgba(92, 95, 104, 0.08)",
};

function TendenciaIcon({ direcao }: { direcao: TendenciaDirecao }) {
    const cor = TENDENCIA_CORES[direcao];
    if (direcao === "subida") return <IconTrendingUp size={14} color={cor} stroke={2.4} />;
    if (direcao === "queda") return <IconTrendingDown size={14} color={cor} stroke={2.4} />;
    return null;
}

function KpiTile({ label, valor, accent }: { label: string; valor: number; accent: string }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                bgcolor: "#F8F9FB",
                borderRadius: 2,
                pl: 1.5,
                pr: 1.5,
                py: 1,
                minHeight: 48,
                position: "relative",
                overflow: "hidden",
                transition: "background-color 0.2s ease",
                "&:hover": {
                    bgcolor: "#F1F4F9",
                },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    borderRadius: "0 3px 3px 0",
                    bgcolor: accent,
                },
            }}
        >
            <Typography
                sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#2F323A",
                    lineHeight: 1.1,
                    minWidth: 26,
                    textAlign: "right",
                }}
            >
                {valor}
            </Typography>
            <Typography
                sx={{
                    fontSize: "0.72rem",
                    color: "#5C5F68",
                    lineHeight: 1.25,
                    flex: 1,
                    fontWeight: 500,
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

export function PulsoSemanaCard({ pulso, onVerDetalhes }: Props) {
    const headerId = "pulso-semana-titulo";

    if (pulso.historico.length === 0) {
        return (
            <Box
                component="section"
                aria-labelledby={headerId}
                sx={{
                    ...CARD_STYLE,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    textAlign: "center",
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
                    Desempenho da semana
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                    Sem encontros registrados ainda
                </Typography>
                <Button
                    variant="contained"
                    onClick={onVerDetalhes}
                    sx={{
                        textTransform: "none",
                        bgcolor: BRAND,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        px: 2,
                        py: 1.25,
                        borderRadius: 2,
                        "&:hover": { bgcolor: BRAND_HOVER },
                        ...FOCUS_OUTLINE,
                    }}
                >
                    Lançar primeiro encontro
                </Button>
            </Box>
        );
    }

    const corTendencia = TENDENCIA_CORES[pulso.tendencia.direcao];
    const bgTendencia = TENDENCIA_BG[pulso.tendencia.direcao];

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
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
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
                    Desempenho da semana
                </Typography>
                <Chip
                    icon={<TendenciaIcon direcao={pulso.tendencia.direcao} />}
                    label={rotularTendencia(pulso.tendencia)}
                    size="small"
                    sx={{
                        height: 24,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor: bgTendencia,
                        color: corTendencia,
                        borderRadius: 1.5,
                        "& .tabler-icon": { ml: 0.5 },
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 2.5, md: 3 },
                    alignItems: { xs: "stretch", md: "flex-start" },
                    flex: 1,
                    minHeight: 0,
                }}
            >
                {/* gráfico */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.8rem", color: "#5C5F68" }}>
                        Presenças nos últimos encontros
                    </Typography>
                    <MiniChart historico={pulso.historico} />
                </Box>

                {/* coluna com KPIs e botão */}
                <Box
                    sx={{
                        width: { xs: "100%", md: 200 },
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.25,
                    }}
                >
                    <Tooltip title="Pessoas presentes no último encontro" arrow placement="left">
                        <Box>
                            <KpiTile label="Presentes" valor={pulso.presencas} accent={SUCCESS} />
                        </Box>
                    </Tooltip>
                    <Tooltip title="Faltas com justificativa" arrow placement="left">
                        <Box>
                            <KpiTile label="Faltas justificadas" valor={pulso.justificados} accent={WARNING} />
                        </Box>
                    </Tooltip>
                    <Tooltip title="Faltas sem justificativa" arrow placement="left">
                        <Box>
                            <KpiTile label="Faltas" valor={pulso.faltas} accent={DANGER} />
                        </Box>
                    </Tooltip>

                    <Button
                        variant="contained"
                        onClick={onVerDetalhes}
                        sx={{
                            textTransform: "none",
                            bgcolor: BRAND,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            px: 2,
                            py: 1.25,
                            borderRadius: 2,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            mt: { xs: 0.5, md: "auto" },
                            "&:hover": {
                                bgcolor: BRAND_HOVER,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                            },
                            ...FOCUS_OUTLINE,
                        }}
                    >
                        Ver detalhes do encontro
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
