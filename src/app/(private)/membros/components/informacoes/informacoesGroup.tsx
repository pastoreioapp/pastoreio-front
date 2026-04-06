import { Box, Paper, Typography } from "@mui/material";

export function InformacoesGroup({
    titulo,
    campos,
}: {
    titulo: string;
    campos: { label: string; valor: string | null }[];
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3,
                p: 2.5,
                bgcolor: "#FAFBFC",
                width: "100%",
            }}
        >
            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 2,
                }}
            >
                {titulo}
            </Typography>
            {campos.map((campo, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                        {campo.label}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: ".9rem",
                            width: "100%",
                            color: campo.valor ? "#000" : "text.disabled",
                            mt: 0.5,
                        }}
                    >
                        {campo.valor || "—"}
                    </Typography>
                </Box>
            ))}
        </Paper>
    );
}
