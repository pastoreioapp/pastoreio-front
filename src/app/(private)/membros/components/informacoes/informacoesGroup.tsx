import { Box, Divider, Input, InputLabel, Typography } from "@mui/material";

export function InformacoesGroup({
    titulo,
    campos,
}: {
    titulo: string;
    campos: { label: string; valor: string | null }[];
}) {
    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <Box>
                <Typography sx={{ color: "#C5C5C5", fontSize: "1rem", fontWeight: 500 }}>
                    {titulo}
                </Typography>
                <Divider
                    sx={{
                        my: 2,
                        borderColor: "#C5C5C5",
                        width: "100%",
                    }}
                />
            </Box>
            {campos.map((campo, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <InputLabel sx={{color: "#C5C5C5", fontSize: ".85rem", fontWeight: 800 }}>
                        {campo.label}
                    </InputLabel>
                    <Typography sx={{ fontSize: ".9rem", width: "100%", color: "#000", mt: 0.5 }}>
                        {campo.valor ?? ""}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
