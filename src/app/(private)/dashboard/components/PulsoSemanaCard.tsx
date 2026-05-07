"use client";

import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { BRAND, BRAND_HOVER, CARD_STYLE, DANGER, SUCCESS, WARNING, FOCUS_OUTLINE } from "../lib/tokens";

export type TendenciaDirecao = "subida" | "queda" | "estavel";

export type HistoricoEncontro = {
    data: string;
    presencas: number;
};

export type PulsoSemana = {
    presencas: number;
    justificados: number;
    faltas: number;
    tendencia: {
        direcao: TendenciaDirecao;
        label: string;
    };
    historico: HistoricoEncontro[];
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

// Converte "YYYY-MM-DD" em "dd/mm" sem depender do fuso horário do navegador.
function formatarDataCurta(data: string): string {
    const partes = data.slice(0, 10).split("-");
    if (partes.length !== 3) return data;
    const [, mes, dia] = partes;
    return `${dia}/${mes}`;
}

// "dd 'de' MMMM" para uso no tooltip, em português.
const MESES_EXTENSO = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function formatarDataExtensa(data: string): string {
    const partes = data.slice(0, 10).split("-");
    if (partes.length !== 3) return data;
    const [, mes, dia] = partes;
    const indiceMes = Number(mes) - 1;
    const nomeMes = MESES_EXTENSO[indiceMes] ?? mes;
    return `${Number(dia)} de ${nomeMes}`;
}

function TendenciaIcon({ direcao }: { direcao: TendenciaDirecao }) {
    const cor = TENDENCIA_CORES[direcao];
    if (direcao === "subida") return <IconTrendingUp size={14} color={cor} stroke={2.4} />;
    if (direcao === "queda") return <IconTrendingDown size={14} color={cor} stroke={2.4} />;
    return null;
}

function MiniChart({ historico }: { historico: HistoricoEncontro[] }) {
    const valores = historico.map((h) => h.presencas);
    const maximo = Math.max(...valores, 1);
    const media = valores.reduce((s, v) => s + v, 0) / valores.length;
    const mediaPct = (media / maximo) * 100;

    const descricaoBarras = historico
        .map((h) => `${formatarDataExtensa(h.data)}: ${h.presencas} presenças`)
        .join("; ");
    const ariaLabel = `Presenças nos últimos ${historico.length} encontros — ${descricaoBarras}`;

    return (
        <Box
            role="img"
            aria-label={ariaLabel}
            sx={{ position: "relative", mt: 1, pt: "18px" }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 0.75,
                    height: 150,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {historico.map((item, i) => {
                    const altura = Math.max((item.presencas / maximo) * 100, 8);
                    const eUltimo = i === historico.length - 1;
                    const titulo = `Encontro de ${formatarDataExtensa(item.data)} — ${item.presencas} ${item.presencas === 1 ? "presença" : "presenças"}`;
                    return (
                        <Box
                            key={`coluna-${item.data}-${i}`}
                            sx={{
                                flex: 1,
                                height: "100%",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Typography
                                sx={{
                                    position: "absolute",
                                    bottom: `${altura}%`,
                                    left: 0,
                                    right: 0,
                                    textAlign: "center",
                                    fontSize: "0.7rem",
                                    fontWeight: eUltimo ? 700 : 600,
                                    color: eUltimo ? BRAND : "#2F323A",
                                    lineHeight: 1,
                                    mb: "3px",
                                    pointerEvents: "none",
                                }}
                            >
                                {item.presencas}
                            </Typography>
                            <Tooltip
                                title={titulo}
                                arrow
                                placement="top"
                            >
                                <Box
                                    sx={{
                                        width: "100%",
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
                        </Box>
                    );
                })}

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
            </Box>

            {/* datas dos encontros */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mt: 0.75,
                    gap: 0.75,
                }}
            >
                {historico.map((item, i) => {
                    const eUltimo = i === historico.length - 1;
                    return (
                        <Box
                            key={`label-${item.data}-${i}`}
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.25,
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontSize: "0.65rem",
                                    fontWeight: eUltimo ? 700 : 500,
                                    color: eUltimo ? BRAND : "text.secondary",
                                    lineHeight: 1.4,
                                }}
                            >
                                {formatarDataCurta(item.data)}
                            </Typography>
                            {eUltimo && (
                                <Box
                                    sx={{
                                        bgcolor: BRAND,
                                        color: "#fff",
                                        fontSize: "0.55rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                        px: 0.75,
                                        py: 0.125,
                                        borderRadius: 1,
                                        lineHeight: 1.4,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Esta semana
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
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
                    label={pulso.tendencia.label}
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
