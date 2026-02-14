import { Box, Input, InputLabel, Typography } from "@mui/material";

export function InformacoesGroup({
    campos,
}: {
    campos: { label: string; valor: string | number | boolean }[];
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
                            value={typeof campo.valor === "boolean" ? (campo.valor ? "Sim" : "Não") : campo.valor}
                            sx={{
                                fontSize: "11px",
                                width: "100%",
                            }}
                            disableUnderline
                            disabled
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
