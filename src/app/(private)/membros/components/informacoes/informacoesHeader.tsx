import type { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import { getFuncaoCores, getFuncaoLabel } from "../../lib/getFuncaoLabel";
import { Avatar, Box, Typography } from "@mui/material";

export function InformacaoHeader({
    nome,
    funcao,
    avatarUrl,
}: {
    nome: string | null;
    funcao: PapelCelula | null;
    avatarUrl?: string | null;
}) {
    const displayNome = nome ?? "";
    const displayFuncao = getFuncaoLabel(funcao);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                flexShrink: 0,
                mt: { xs: -5, md: -6 },
            }}
        >
            <Avatar
                src={avatarUrl || undefined}
                sx={{
                    width: 96,
                    height: 96,
                    fontSize: 32,
                    fontWeight: 700,
                    bgcolor: "#5E79B3",
                    color: "#fff",
                    border: "4px solid #fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
            >
                {displayNome.charAt(0) || "?"}
            </Avatar>
            <Typography
                sx={{
                    mt: 1.5,
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#000",
                    textAlign: { xs: "center", md: "left" },
                }}
            >
                {displayNome}
            </Typography>
            <Box
                sx={{
                    ...getFuncaoCores(funcao),
                    mt: 1,
                    py: 0.5,
                    px: 2,
                    borderRadius: 1,
                }}
            >
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    {displayFuncao}
                </Typography>
            </Box>
        </Box>
    );
}
