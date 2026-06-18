"use client";

import { Box, Tooltip, Typography } from "@mui/material";
import type { HistoricoEncontroDto } from "@/modules/celulas/application/dashboard-dtos";
import { BRAND } from "../lib/tokens";
import { formatarDataCurta, formatarDataExtensa } from "@/ui/utils/datas";

type Props = {
    historico: HistoricoEncontroDto[];
};

export function MiniChart({ historico }: Props) {
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
