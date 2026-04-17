"use client";

import { useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import {
    IconAlertTriangle,
    IconCheck,
    IconClockPause,
    IconDots,
    IconMessageCircle,
    IconNotebook,
    IconUser,
} from "@tabler/icons-react";
import { BRAND, BRAND_HOVER, DANGER, WARNING, FOCUS_OUTLINE } from "../lib/tokens";

export type Severidade = "critico" | "alerta" | "observacao";

export type MembroAtencao = {
    id: string;
    nome: string;
    avatarUrl?: string;
    severidade: Severidade;
    motivos: string[];
    diasSemContato: number;
};

type Props = {
    membro: MembroAtencao;
    index: number;
    onVerFicha?: (id: string) => void;
    onEnviarMensagem?: (id: string) => void;
    onRegistrarPastoreio?: (id: string) => void;
    onMarcarAcompanhado?: (id: string) => void;
    onAdiar?: (id: string) => void;
};

const SEVERIDADE_COR: Record<Severidade, string> = {
    critico: DANGER,
    alerta: WARNING,
    observacao: BRAND,
};

const SEVERIDADE_LABEL: Record<Severidade, string> = {
    critico: "Crítico",
    alerta: "Alerta",
    observacao: "Observação",
};

const STAGGER_DELAY_MS = 50;

export function MembroAtencaoItem({
    membro,
    index,
    onVerFicha,
    onEnviarMensagem,
    onRegistrarPastoreio,
    onMarcarAcompanhado,
    onAdiar,
}: Props) {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const corSeveridade = SEVERIDADE_COR[membro.severidade];

    const iniciais = membro.nome
        .split(" ")
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join("");

    return (
        <Box
            component="li"
            sx={{
                display: "flex",
                gap: 2,
                p: { xs: 2, md: 2.5 },
                borderRadius: 2.5,
                border: "1px solid #ECECEC",
                bgcolor: "rgba(243, 243, 250, 0.3)",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "stretch" },
                position: "relative",
                overflow: "hidden",
                listStyle: "none",
                animation: `fadeInUp 400ms ease-out ${index * STAGGER_DELAY_MS}ms both`,
                "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(8px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: corSeveridade,
                    borderRadius: "4px 0 0 4px",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: 1.5,
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Avatar
                    src={membro.avatarUrl}
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: BRAND,
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        flexShrink: 0,
                    }}
                >
                    {iniciais || <IconUser size={22} />}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography
                            component="span"
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: "#2F323A",
                            }}
                        >
                            {membro.nome}
                        </Typography>
                        <Chip
                            label={SEVERIDADE_LABEL[membro.severidade]}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                bgcolor: `${corSeveridade}14`,
                                color: corSeveridade,
                                borderRadius: 1,
                                "& .MuiChip-label": { px: 0.75 },
                            }}
                        />
                    </Box>
                    <Box
                        component="ul"
                        sx={{
                            m: 0,
                            pl: 2,
                            color: "#5C5F68",
                            fontSize: "0.8rem",
                            lineHeight: 1.6,
                        }}
                    >
                        {membro.motivos.map((motivo, i) => (
                            <Typography
                                key={i}
                                component="li"
                                sx={{ fontSize: "0.8rem", color: "#5C5F68" }}
                            >
                                {motivo}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    flexShrink: 0,
                    alignItems: "center",
                    flexDirection: { xs: "row", sm: "row" },
                    justifyContent: { xs: "flex-end", sm: "flex-start" },
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => onEnviarMensagem?.(membro.id)}
                    startIcon={<IconMessageCircle size={16} />}
                    aria-label={`Enviar mensagem para ${membro.nome}`}
                    sx={{
                        textTransform: "none",
                        bgcolor: BRAND,
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        boxShadow: "none",
                        whiteSpace: "nowrap",
                        "&:hover": { bgcolor: BRAND_HOVER, boxShadow: "none" },
                        ...FOCUS_OUTLINE,
                    }}
                >
                    Enviar mensagem
                </Button>
                <Button
                    variant="text"
                    onClick={() => onVerFicha?.(membro.id)}
                    aria-label={`Ver ficha de ${membro.nome}`}
                    sx={{
                        textTransform: "none",
                        color: BRAND,
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        px: 1,
                        whiteSpace: "nowrap",
                        ...FOCUS_OUTLINE,
                    }}
                >
                    Ver ficha
                </Button>
                <IconButton
                    size="small"
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    aria-label={`Mais ações para ${membro.nome}`}
                    sx={{ color: "#5C5F68", ...FOCUS_OUTLINE }}
                >
                    <IconDots size={18} />
                </IconButton>
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    slotProps={{
                        paper: {
                            sx: { borderRadius: 2, minWidth: 200, mt: 0.5 },
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            onRegistrarPastoreio?.(membro.id);
                            setMenuAnchor(null);
                        }}
                    >
                        <ListItemIcon><IconNotebook size={18} /></ListItemIcon>
                        <ListItemText>Registrar pastoreio</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            onMarcarAcompanhado?.(membro.id);
                            setMenuAnchor(null);
                        }}
                    >
                        <ListItemIcon><IconCheck size={18} /></ListItemIcon>
                        <ListItemText>Marcar como acompanhado</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            onAdiar?.(membro.id);
                            setMenuAnchor(null);
                        }}
                    >
                        <ListItemIcon><IconClockPause size={18} /></ListItemIcon>
                        <ListItemText>Adiar 7 dias</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

export function MembroAtencaoEmpty() {
    return (
        <Box
            sx={{
                border: "2px dashed #DEE3EA",
                borderRadius: 3,
                py: 5,
                px: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                textAlign: "center",
            }}
        >
            <IconAlertTriangle size={40} stroke={1.5} color="#5A6A85" />
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                Nenhum membro precisa de atenção no momento.
            </Typography>
        </Box>
    );
}
