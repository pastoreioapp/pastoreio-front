import { Avatar, Box, Typography } from "@mui/material";

export function InformacaoHeader({
    nome,
    funcao,
}: {
    nome: string;
    funcao: string;
}) {
    return (
        <Box
            sx={{
                mt: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Avatar
                sx={{
                    width: "180px",
                    height: "180px",
                    fontSize: 48,
                    fontWeight: "bold",
                    backgroundColor: "#5E79B3",
                    color: "#fff",
                    boxShadow: "inset 0 0 0 6px #91A3D8",
                }}
            >
                {nome.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
                sx={{ mt: "12px", fontSize: "18px", fontWeight: "500" }}
            >
                {nome}
            </Typography>
            <Box
                sx={{
                    bgcolor: "#5E79B3",
                    py: "2px",
                    px: "9px",
                    color: "#fff",
                    borderRadius: 1,
                }}
            >
                <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                    {funcao}
                </Typography>
            </Box>
        </Box>
    );
}
