import { Box, Button, Typography } from "@mui/material";
import { IconArrowRight } from "@tabler/icons-react";
import { FOCUS_OUTLINE } from "../lib/tokens";

type Props = {
    titulo: string;
    mensagem: string;
    versiculo: string;
    score?: number;
    onVerDetalhes?: () => void;
};

export function SaudeCelulaCard({
    titulo,
    mensagem,
    versiculo,
    score,
    onVerDetalhes,
}: Props) {
    const headerId = "saude-celula-titulo";

    return (
        <Box
            component="section"
            aria-labelledby={headerId}
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 3,
                background: "linear-gradient(180deg, #7FB77E 0%, #4A845D 100%)",
                color: "#fff",
                p: { xs: 3, md: 3.5 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
                },
            }}
        >
            {score != null && (
                <Box
                    sx={{
                        position: "absolute",
                        top: { xs: 12, md: 16 },
                        right: { xs: 12, md: 16 },
                        bgcolor: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(4px)",
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        zIndex: 2,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                        }}
                    >
                        Score {score}/100
                    </Typography>
                </Box>
            )}

            <Typography
                id={headerId}
                component="h2"
                sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.9,
                    mb: 2,
                }}
            >
                {titulo}
            </Typography>

            <Typography
                sx={{
                    fontSize: { xs: "1.4rem", md: "1.6rem" },
                    fontWeight: 700,
                    lineHeight: 1.25,
                    maxWidth: 280,
                    mb: 3,
                }}
            >
                {mensagem}
            </Typography>

            <Box
                sx={{
                    width: 40,
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                    mb: 2,
                }}
            />

            <Typography
                sx={{
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                    opacity: 1,
                    color: "#F4F4F4",
                    maxWidth: 240,
                    mb: 3,
                }}
            >
                {versiculo}
            </Typography>

            <Button
                onClick={onVerDetalhes}
                endIcon={<IconArrowRight size={16} stroke={2.2} />}
                sx={{
                    alignSelf: "flex-start",
                    color: "#fff",
                    px: 0,
                    mt: "auto",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                        bgcolor: "transparent",
                        opacity: 0.85,
                    },
                    ...FOCUS_OUTLINE,
                }}
            >
                Ver detalhes
            </Button>

            {/* ondas decorativas */}
            <Box
                component="svg"
                viewBox="0 0 200 100"
                preserveAspectRatio="none"
                sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: { xs: 160, md: 220 },
                    height: { xs: 80, md: 100 },
                    pointerEvents: "none",
                    opacity: 0.12,
                }}
            >
                <path
                    d="M0 60 Q50 30 100 50 T200 40 V100 H0Z"
                    fill="#fff"
                />
                <path
                    d="M0 75 Q40 55 90 70 T200 55 V100 H0Z"
                    fill="#fff"
                />
            </Box>
        </Box>
    );
}
