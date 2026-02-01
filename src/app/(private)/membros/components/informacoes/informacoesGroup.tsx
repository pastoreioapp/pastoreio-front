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
                mt: "32px",
                width: "100%",
            }}
        >
            <Box>
                <Typography sx={{ color: "#C5C5C5", fontSize: "14px" }}>
                    {titulo}
                </Typography>
                <Divider
                    sx={{
                        mt: "11px",
                        marginBottom: "14px",
                        borderColor: "#C5C5C5",
                        width: "100%",
                    }}
                />
            </Box>
            {campos.map((campo, index) => (
                <Box key={index} sx={{ mb: "12px" }}>
                    <InputLabel sx={{ color: "#000", fontSize: "14px" }}>
                        {campo.label}
                    </InputLabel>
                    <Input
                        value={campo.valor ?? ""}
                        sx={{ fontSize: "11px", width: "100%" }}
                        disableUnderline
                        disabled
                    />
                </Box>
            ))}
        </Box>
    );
}
