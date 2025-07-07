import {
    Box,
    Divider,
    Grid,
    Input,
    InputLabel,
    Typography,
} from "@mui/material";

export function InformacoesGroup({
    titulo,
    campos,
}: {
    titulo: string;
    campos: { label: string; valor: string }[];
}) {
    return (
        <Grid item xs={6} sm={4} md={3}>
            <Box>
                <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: "#C5C5C5", fontSize: "14px" }}
                >
                    {titulo}
                </Typography>
                <Divider sx={{ mb: 1, borderColor: "#C5C5C5" }} />
            </Box>
            {campos.map((campo, index) => (
                <Box key={index}>
                    <InputLabel sx={{ color: "#000", fontSize: "14px" }}>
                        {campo.label}
                    </InputLabel>
                    <Input
                        value={campo.valor}
                        sx={{ fontSize: "11px" }}
                        disableUnderline
                        disabled
                    />
                </Box>
            ))}
        </Grid>
    );
}
