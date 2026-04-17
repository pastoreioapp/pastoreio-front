import { Box, Button, Typography } from "@mui/material";
import {
    IconCalendarCheck,
    IconUserPlus,
    IconUserUp,
} from "@tabler/icons-react";
import { BRAND, BRAND_HOVER, CARD_STYLE, FOCUS_OUTLINE } from "../lib/tokens";

type Props = {
    onLancarFrequencia?: () => void;
    onRegistrarVisitante?: () => void;
    onCadastrarMembro?: () => void;
};

export function AcoesRapidasCard({
    onLancarFrequencia,
    onRegistrarVisitante,
    onCadastrarMembro,
}: Props) {
    const headerId = "acoes-rapidas-titulo";

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
            <Typography
                id={headerId}
                component="h2"
                sx={{
                    fontSize: { xs: "1.05rem", md: "1.2rem" },
                    fontWeight: 600,
                    color: "#2F323A",
                }}
            >
                Ações rápidas
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                <Button
                    variant="contained"
                    onClick={onLancarFrequencia}
                    startIcon={<IconCalendarCheck size={20} />}
                    sx={{
                        textTransform: "none",
                        bgcolor: BRAND,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        py: 1.75,
                        borderRadius: 2,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        "&:hover": {
                            bgcolor: BRAND_HOVER,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        },
                        ...FOCUS_OUTLINE,
                    }}
                >
                    Lançar frequência
                </Button>
                <Button
                    variant="outlined"
                    onClick={onRegistrarVisitante}
                    startIcon={<IconUserPlus size={20} />}
                    sx={{
                        textTransform: "none",
                        bgcolor: "#fff",
                        color: BRAND,
                        borderColor: "rgba(94, 121, 179, 0.25)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        py: 1.75,
                        borderRadius: 2,
                        "&:hover": {
                            borderColor: BRAND,
                            bgcolor: "rgba(94, 121, 179, 0.06)",
                        },
                        ...FOCUS_OUTLINE,
                    }}
                >
                    Registrar visitante
                </Button>
                <Button
                    variant="text"
                    onClick={onCadastrarMembro}
                    startIcon={<IconUserUp size={18} />}
                    sx={{
                        textTransform: "none",
                        color: BRAND,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        py: 1,
                        "&:hover": {
                            bgcolor: "rgba(94, 121, 179, 0.06)",
                        },
                        ...FOCUS_OUTLINE,
                    }}
                >
                    Cadastrar membro
                </Button>
            </Box>
        </Box>
    );
}
