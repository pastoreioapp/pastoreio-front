"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventContentArg, EventInput } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import { FrequenciaPopover } from "./frequenciaPopover";
import type { FrequenciaDoMembroDto } from "@/modules/frequencias/application/dtos";
import {
    TipoFrequencia,
    TIPO_FREQUENCIA_LABEL,
    TIPO_FREQUENCIA_COR,
} from "@/modules/frequencias/domain/tipo-frequencia";

type Props = {
    frequencias: FrequenciaDoMembroDto[];
};

const LEGENDA_TIPOS = Object.values(TipoFrequencia).map((tipo) => ({
    tipo,
    label: TIPO_FREQUENCIA_LABEL[tipo],
    cor: TIPO_FREQUENCIA_COR[tipo],
}));

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function toEvents(frequencias: FrequenciaDoMembroDto[]): EventInput[] {
    return frequencias.map((f) => ({
        id: f.id,
        title: f.tipoLabel,
        date: f.data,
        backgroundColor: f.presente ? f.cor : hexToRgba(f.cor, 0.12),
        borderColor: f.presente ? f.cor : hexToRgba(f.cor, 0.4),
        textColor: f.presente ? "#fff" : f.cor,
        extendedProps: { dto: f },
    }));
}

function getCalendarStyles(compact: boolean) {
    return {
        ".fc": {
            fontFamily: "inherit",
            "--fc-border-color": "#EEF0F4",
            "--fc-today-bg-color": "rgba(94, 121, 179, 0.05)",
            "--fc-neutral-bg-color": "#FAFBFC",
            "--fc-page-bg-color": "transparent",
            "--fc-button-bg-color": "transparent",
            "--fc-button-border-color": "#DEE3EA",
            "--fc-button-text-color": "#5A6A85",
            "--fc-button-hover-bg-color": "rgba(94, 121, 179, 0.08)",
            "--fc-button-hover-border-color": "#5E79B3",
            "--fc-button-active-bg-color": "rgba(94, 121, 179, 0.12)",
            "--fc-button-active-border-color": "#5E79B3",
        },

        ".fc .fc-toolbar": {
            marginBottom: compact ? "8px" : "12px",
            gap: compact ? "6px" : undefined,
        },
        ".fc .fc-toolbar-title": {
            fontSize: compact ? "0.9rem" : "1.05rem",
            fontWeight: 600,
            textTransform: "capitalize" as const,
            color: "#000",
        },
        ".fc .fc-button": {
            fontSize: compact ? "0.72rem" : "0.78rem",
            padding: compact ? "3px 8px" : "4px 12px",
            borderRadius: "6px",
            fontWeight: 500,
            transition: "all 0.15s ease",
            boxShadow: "none !important",
        },
        ".fc .fc-button-primary:hover": {
            backgroundColor: "rgba(94, 121, 179, 0.08)",
            borderColor: "#5E79B3",
            color: "#5E79B3",
        },
        ".fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active": {
            backgroundColor: "rgba(94, 121, 179, 0.12)",
            borderColor: "#5E79B3",
            color: "#5E79B3",
        },
        ".fc .fc-button-primary:focus": {
            boxShadow: "0 0 0 2px rgba(94, 121, 179, 0.2) !important",
        },
        ".fc .fc-button-group > .fc-button": {
            borderRadius: "6px",
            marginLeft: "4px",
        },

        ".fc .fc-col-header-cell": {
            backgroundColor: "#FAFBFC",
            borderBottom: "1px solid #EEF0F4",
        },
        ".fc .fc-col-header-cell-cushion": {
            textTransform: "capitalize" as const,
            fontSize: compact ? "0.68rem" : "0.75rem",
            fontWeight: 600,
            color: "#5A6A85",
            padding: compact ? "5px 2px" : "8px 4px",
            textDecoration: "none !important",
        },

        ".fc .fc-daygrid-day": {
            transition: "background-color 0.12s ease",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "rgba(94, 121, 179, 0.03)",
            },
        },
        ".fc .fc-daygrid-day-number": {
            fontSize: compact ? "0.7rem" : "0.78rem",
            fontWeight: 500,
            color: "#5A6A85",
            padding: compact ? "3px 4px" : "6px 8px",
            textDecoration: "none !important",
        },
        ".fc .fc-day-today .fc-daygrid-day-number": {
            color: "#5E79B3",
            fontWeight: 700,
        },
        ".fc .fc-day-other .fc-daygrid-day-number": {
            opacity: 0.35,
        },

        ".fc .fc-daygrid-event": {
            borderRadius: compact ? "3px" : "4px",
            fontSize: compact ? "0px" : "0.67rem",
            lineHeight: 1.4,
            padding: compact ? "2px 0" : "1px 5px",
            cursor: "pointer",
            transition: "opacity 0.12s ease, transform 0.12s ease",
            marginBottom: "1px",
            border: "1px solid",
            "&:hover": {
                opacity: 0.8,
                transform: compact ? "none" : "scale(1.02)",
            },
        },
        ".fc .fc-daygrid-event-dot": {
            display: "none",
        },
        ".fc .fc-daygrid-more-link": {
            fontSize: compact ? "0.62rem" : "0.7rem",
            fontWeight: 600,
            color: "#5E79B3",
        },

        ".fc .fc-scrollgrid": {
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #EEF0F4",
        },
        ".fc table": {
            borderCollapse: "separate" as const,
            borderSpacing: 0,
        },
    };
}

export function FrequenciaCalendario({ frequencias }: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
    const [popoverEventos, setPopoverEventos] = useState<FrequenciaDoMembroDto[]>([]);
    const calendarRef = useRef<FullCalendar>(null);

    const calendarStyles = useMemo(() => getCalendarStyles(isMobile), [isMobile]);

    const renderEvent = useCallback(
        (arg: EventContentArg) => {
            const dto = arg.event.extendedProps.dto as FrequenciaDoMembroDto;

            if (isMobile) {
                return (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                        <span
                            style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: dto.presente ? "currentColor" : "transparent",
                                border: "1.5px solid currentColor",
                            }}
                        />
                    </span>
                );
            }

            return (
                <span style={{ display: "flex", alignItems: "center", gap: "4px", overflow: "hidden" }}>
                    <span
                        style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: dto.presente ? "currentColor" : "transparent",
                            border: "1.5px solid currentColor",
                            flexShrink: 0,
                        }}
                    />
                    <span
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "inherit",
                            fontWeight: 500,
                        }}
                    >
                        {arg.event.title}
                    </span>
                </span>
            );
        },
        [isMobile],
    );

    const openPopoverForDate = useCallback(
        (dateStr: string, anchorEl: HTMLElement) => {
            const eventosDoDia = frequencias.filter((f) => f.data === dateStr);
            if (eventosDoDia.length === 0) return;
            setPopoverEventos(eventosDoDia);
            setPopoverAnchor(anchorEl);
        },
        [frequencias],
    );

    const handleDateClick = useCallback(
        (info: DateClickArg) => {
            openPopoverForDate(info.dateStr, info.dayEl);
        },
        [openPopoverForDate],
    );

    const handleEventClick = useCallback(
        (info: EventClickArg) => {
            const dateStr = info.event.startStr;
            const dayCell = info.el.closest(".fc-daygrid-day") as HTMLElement;
            openPopoverForDate(dateStr, dayCell ?? info.el);
        },
        [openPopoverForDate],
    );

    const handleClosePopover = useCallback(() => {
        setPopoverAnchor(null);
        setPopoverEventos([]);
    }, []);

    const events = toEvents(frequencias);

    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3,
                p: { xs: 1.5, md: 3 },
                bgcolor: "#fff",
                overflow: "hidden",
            }}
        >
            <Box sx={{ overflowX: { xs: "auto", sm: "visible" }, mx: { xs: -0.5, sm: 0 } }}>
                <Box sx={{ minWidth: { xs: 300, sm: "auto" }, ...calendarStyles }}>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale="pt-br"
                        events={events}
                        eventContent={renderEvent}
                        eventClick={handleEventClick}
                        dateClick={handleDateClick}
                        headerToolbar={
                            isMobile
                                ? { left: "title", right: "prev,next" }
                                : { left: "prev,next today", center: "title", right: "" }
                        }
                        buttonText={{ today: "Hoje" }}
                        height="auto"
                        dayMaxEvents={isMobile ? 2 : 3}
                        dayHeaderFormat={{ weekday: isMobile ? "narrow" : "short" }}
                        fixedWeekCount={false}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 3 },
                    mt: 2,
                    pt: 1.5,
                    borderTop: "1px solid #EEF0F4",
                    flexWrap: "wrap",
                }}
            >
                {LEGENDA_TIPOS.map((item) => (
                    <Box key={item.tipo} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box
                            sx={{
                                width: { xs: 8, md: 10 },
                                height: { xs: 8, md: 10 },
                                borderRadius: "50%",
                                bgcolor: item.cor,
                            }}
                        />
                        <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.73rem" }, color: "text.secondary", fontWeight: 500 }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: { xs: 0, md: 1.5 },
                        borderLeft: { xs: "none", md: "1px solid #ECECEC" },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#5A6A85" }} />
                        <Typography sx={{ fontSize: { xs: "0.62rem", md: "0.68rem" }, color: "text.secondary" }}>
                            Presente
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", border: "1.5px solid #5A6A85", bgcolor: "transparent" }} />
                        <Typography sx={{ fontSize: { xs: "0.62rem", md: "0.68rem" }, color: "text.secondary" }}>
                            Ausente
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <FrequenciaPopover
                anchorEl={popoverAnchor}
                open={Boolean(popoverAnchor)}
                onClose={handleClosePopover}
                eventos={popoverEventos}
            />
        </Paper>
    );
}
