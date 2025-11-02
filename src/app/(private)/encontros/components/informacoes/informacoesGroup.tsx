import { Box, Input, InputLabel, Typography } from "@mui/material";

export function InformacoesGroup({
    campos,
}: {
    campos: { label: string; valor: string | number }[];
}) {
    return (
        <Box>
            {campos.map((campo, index) => (
                <Box key={index} sx={{ mb: "12px" }}>
                    <InputLabel
                        sx={{
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        {campo.label}
                    </InputLabel>
                    <Box sx={{ display: "flex", gap: "1px" }}>
                        <Input
                            value={campo.valor}
                            sx={{
                                fontSize: "11px",
                                width: "100%",
                            }}
                            disableUnderline
                            disabled
                        />
                        {campo.label === "Anfitrião" && (
                            <Typography
                                fontSize={11}
                                sx={{ color: "#0099F8", cursor: "pointer" }}
                            >
                                (endereço)
                            </Typography>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
