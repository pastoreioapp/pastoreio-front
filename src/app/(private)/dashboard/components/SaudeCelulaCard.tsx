import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { IconArrowRight } from "@tabler/icons-react";
import type { SaudeCelulaResult } from "@/modules/celulas/application/saude-dtos";
import { FOCUS_OUTLINE } from "../lib/tokens";
import { SAUDE_VARIANTES, variantePorClasse } from "../lib/saude-variantes";

type Props = {
    titulo: string;
    mensagem: string;
    versiculo: string;
    classe: SaudeCelulaResult["classe"];
    onVerDetalhes?: () => void;
    detalhesLoading?: boolean;
};

export function SaudeCelulaCard({
    titulo,
    mensagem,
    versiculo,
    classe,
    onVerDetalhes,
    detalhesLoading = false,
}: Props) {
    const headerId = "saude-celula-titulo";
    const tokens = SAUDE_VARIANTES[variantePorClasse(classe)];

    return (
        <Box
            component="section"
            aria-labelledby={headerId}
            data-variante={tokens.variante}
            sx={{
                position: "relative",
                zIndex: 1,
                overflow: "visible",
                borderRadius: 3,
                background: tokens.background,
                color: "#fff",
                p: { xs: 3, md: 3.5 },
                height: "450px",
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
            <Box
                component="img"
                src={tokens.icone.src}
                alt=""
                aria-hidden="true"
                sx={{
                    position: "absolute",
                    right: { xs: -15, md: -20 },
                    bottom: { xs: -15, md: -22 },
                    width: { xs: 160, md: 224 },
                    height: { xs: 160, md: 224 },
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 0,
                }}
            />
      

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
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
                        borderBottom: `2px solid ${tokens.divisorColor}`,
                        mb: 2,
                    }}
                />

                <Typography
                    sx={{
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        opacity: 1,
                        color: tokens.versiculoColor,
                        maxWidth: 240,
                        mb: 3,
                    }}
                >
                    {versiculo}
                </Typography>

                <Button
                    onClick={onVerDetalhes}
                    disabled={detalhesLoading}
                    aria-label={
                        detalhesLoading
                            ? "Carregando dados da saúde da célula"
                            : "Ver detalhes da saúde da célula"
                    }
                    endIcon={
                        detalhesLoading ? (
                            <CircularProgress
                                size={14}
                                thickness={5}
                                sx={{ color: tokens.linkColor }}
                            />
                        ) : (
                            <IconArrowRight size={16} stroke={2.2} />
                        )
                    }
                    sx={{
                        alignSelf: "flex-start",
                        color: tokens.linkColor,
                        px: 0,
                        mt: "auto",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                            bgcolor: "transparent",
                            opacity: 0.85,
                        },
                        "&.Mui-disabled": {
                            color: tokens.linkColor,
                            opacity: 0.7,
                            cursor: "wait",
                            pointerEvents: "auto",
                        },
                        ...FOCUS_OUTLINE,
                    }}
                >
                    {detalhesLoading ? "Carregando detalhes…" : "Ver detalhes"}
                </Button>
            </Box>
        </Box>
    );
}
