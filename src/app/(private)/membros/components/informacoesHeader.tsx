import { Avatar, Box, Grid, Typography } from "@mui/material";

export function InformacaoHeader({
    nome,
    funcao,
}: {
    nome: string;
    funcao: string;
}) {
    return (
        <Grid item xs={6} sm={4} md={3} sx={{ placeItems: "center" }}>
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
            <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
                {nome}
            </Typography>
            <Box
                sx={{
                    bgcolor: "#5E79B3",
                    py: 0.3,
                    px: 1,
                    color: "#fff",
                    borderRadius: 1,
                    mt: "1px",
                }}
            >
                <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                    {funcao}
                </Typography>
            </Box>
        </Grid>
    );
}
