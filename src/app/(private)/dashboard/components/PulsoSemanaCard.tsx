"use client";

import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { BRAND, BRAND_HOVER, CARD_STYLE, DANGER, SUCCESS, FOCUS_OUTLINE } from "../lib/tokens";

export type TendenciaDirecao = "subida" | "queda" | "estavel";

export type PulsoSemana = {
    presencas: number;
    justificados: number;
    faltas: number;
    tendencia: {
        direcao: TendenciaDirecao;
        label: string;
    };
    historicoFrequencia: number[];
};

type Props = {
    pulso: PulsoSemana;
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

const LABELS_SEMANA = ["S-4", "S-3", "S-2", "S-1", "Atual"];

function TendenciaIcon({ direcao }: { direcao: TendenciaDirecao }) {
    const cor = TENDENCIA_CORES[direcao];
    if (direcao === "subida") return <IconTrendingUp size={14} color={cor} stroke={2.4} />;
    if (direcao === "queda") return <IconTrendingDown size={14} color={cor} stroke={2.4} />;
    return null;
}

function MiniChart({ valores }: { valores: number[] }) {
    const maximo = Math.max(...valores, 1);
    const media = valores.reduce((s, v) => s + v, 0) / valores.length;
    const mediaPct = (media / maximo) * 100;

    const ariaLabel = `Tendência de frequência das últimas ${valores.length} semanas, valores ${valores.join(", ")}`;

    return (
        <Box
            role="img"
            aria-label={ariaLabel}
            sx={{ position: "relative", mt: 1 }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 0.75,
                    height: 56,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {valores.map((valor, i) => {
                    const altura = Math.max((valor / maximo) * 100, 8);
                    const eUltimo = i === valores.length - 1;
                    const label = LABELS_SEMANA[LABELS_SEMANA.length - valores.length + i] ?? `S${i + 1}`;
                    return (
                        <Tooltip
                            key={i}
                            title={`${label}: ${valor} presenças`}
                            arrow
                            placement="top"
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    height: `${altura}%`,
                                    borderRadius: "3px 3px 0 0",
                                    bgcolor: eUltimo
                                        ? BRAND
                                        : "rgba(94, 121, 179, 0.25)",
                                    transition: "background-color 0.2s ease",
                                    cursor: "default",
                                }}
                            />
                        </Tooltip>
                    );
                })}
            </Box>

            {/* linha de média */}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `${mediaPct}%`,
                    height: 0,
                    borderBottom: "1.5px dashed rgba(94, 121, 179, 0.35)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            {/* labels de semana */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                    gap: 0.75,
                }}
            >
                {valores.map((_, i) => {
                    const label = LABELS_SEMANA[LABELS_SEMANA.length - valores.length + i] ?? `S${i + 1}`;
                    const eUltimo = i === valores.length - 1;
                    return (
                        <Typography
                            key={i}
                            sx={{
                                flex: 1,
                                textAlign: "center",
                                fontSize: "0.6rem",
                                fontWeight: eUltimo ? 700 : 400,
                                color: eUltimo ? BRAND : "text.secondary",
                            }}
                        >
                            {label}
                        </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}

function KpiTile({ label, valor }: { label: string; valor: number }) {
    return (
        <Box
            sx={{
                flex: 1,
                textAlign: "center",
                bgcolor: "#F8F9FB",
                borderRadius: 2,
                py: 1.5,
                px: 1,
            }}
        >
            <Typography
                sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#2F323A" }}
            >
                {valor}
            </Typography>
            <Typography
                sx={{ fontSize: "0.7rem", color: "#5C5F68", mt: 0.25 }}
            >
                {label}
            </Typography>
        </Box>
    );
}

export function PulsoSemanaCard({ pulso, onVerDetalhes }: Props) {
    const corTendencia = TENDENCIA_CORES[pulso.tendencia.direcao];
    const bgTendencia = TENDENCIA_BG[pulso.tendencia.direcao];
    const headerId = "pulso-semana-titulo";

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
                    label={pulso.tendencia.label}
                    size="small"
                    sx={{
                        height: 24,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor: bgTendencia,
                        color: corTendencia,
                        borderRadius: 1.5,
                        "& .MuiChip-icon": { ml: 0.5 },
                    }}
                />
            </Box>

            <Box>
                <Typography
                    sx={{ fontSize: "0.8rem", color: "#5C5F68" }}
                >
                    Tendência de frequência
                </Typography>
                <MiniChart valores={pulso.historicoFrequencia} />
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
                <KpiTile label="Presenças" valor={pulso.presencas} />
                <KpiTile label="Justificados" valor={pulso.justificados} />
                <KpiTile label="Faltas" valor={pulso.faltas} />
            </Box>

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
                    mt: "auto",
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
    );
}
