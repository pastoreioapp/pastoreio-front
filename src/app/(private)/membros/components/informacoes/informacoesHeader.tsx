import { Avatar, Box, Typography } from "@mui/material";

export function InformacaoHeader({
    nome,
    funcao,
}: {
    nome: string | null;
    funcao: string | null;
}) {
    const displayNome = nome ?? "";
    const displayFuncao = funcao ?? "";
    return (
        <Box
            sx={{
                mt: "32px",
                mr: { xs: 0, md: 5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
            }}
        >
            <Avatar
                sx={{
                    width: "130px",
                    height: "130px",
                    fontSize: 48,
                    fontWeight: "bold",
                    backgroundColor: "#5E79B3",
                    color: "#fff",
                    boxShadow: "inset 0 0 0 6px #91A3D8",
                }}
            >
                {displayNome.charAt(0) || "?"}
            </Avatar>
            <Typography
                sx={{ mt: 2, fontSize: "18px", fontWeight: "500" }}
            >
                {displayNome}
            </Typography>
            <Box
                sx={{
                    bgcolor: displayFuncao === "MEMBRO" ? "#DCE8E6" : "#5E79B3",
                    mt: 1,
                    py: .5,
                    px: 2,
                    color: displayFuncao === "MEMBRO" ? "#1B212D" : "#fff",
                    borderRadius: 1,
                }}
            >
                <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                    {displayFuncao}
                </Typography>
            </Box>
        </Box>
    );
}
