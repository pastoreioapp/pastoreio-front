"use client";

import { Box, Chip, Popover, Typography } from "@mui/material";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { FrequenciaDoMembroDto } from "@/modules/frequencias/application/dtos";

type Props = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    eventos: FrequenciaDoMembroDto[];
};

function formatDateHeader(iso: string): { weekday: string; date: string } {
    const d = new Date(iso + "T12:00:00");
    const weekday = d.toLocaleDateString("pt-BR", { weekday: "long" });
    const date = d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
    return {
        weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
        date: date.charAt(0).toUpperCase() + date.slice(1),
    };
}

export function FrequenciaPopover({ anchorEl, open, onClose, eventos }: Props) {
    if (eventos.length === 0) return null;

    const { weekday, date } = formatDateHeader(eventos[0].data);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        p: 2.5,
                        minWidth: 280,
                        maxWidth: 360,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                    },
                },
            }}
        >
            <Box sx={{ mb: 2 }}>
                <Typography
                    sx={{
                        fontSize: "0.68rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontWeight: 600,
                        lineHeight: 1,
                    }}
                >
                    {weekday}
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "1rem", mt: 0.25 }}>
                    {date}
                </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
                {eventos.map((ev) => (
                    <Box
                        key={ev.id}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                            pl: 1.5,
                            pr: 1.5,
                            py: 1.25,
                            borderRadius: "0 8px 8px 0",
                            bgcolor: "#FAFBFC",
                            borderLeft: `3px solid ${ev.cor}`,
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    color: ev.cor,
                                }}
                            >
                                {ev.tipoLabel}
                            </Typography>
                            <Chip
                                icon={
                                    ev.presente
                                        ? <IconCheck size={12} />
                                        : <IconX size={12} />
                                }
                                label={ev.presente ? "Presente" : "Ausente"}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: "0.65rem",
                                    fontWeight: 500,
                                    bgcolor: ev.presente
                                        ? "rgba(107, 175, 123, 0.12)"
                                        : "rgba(211, 47, 47, 0.08)",
                                    color: ev.presente ? "#3d7a4d" : "#c62828",
                                    "& .MuiChip-icon": {
                                        color: "inherit",
                                        marginLeft: "4px",
                                    },
                                    "& .MuiChip-label": {
                                        px: 0.5,
                                    },
                                }}
                            />
                        </Box>

                        <Typography sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#000" }}>
                            {ev.titulo}
                        </Typography>

                        {ev.descricao && (
                            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", lineHeight: 1.4 }}>
                                {ev.descricao}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
        </Popover>
    );
}
