import { CheckCircleOutline } from "@mui/icons-material";
import { Avatar, Box, Checkbox, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function EtapaCard({
    etapa,
    titulo,
    itens,
}: {
    etapa: number;
    titulo: string;
    itens: { label: string }[];
}) {
    const theme = useTheme();
    const isConcluida = itens.every((item) => false);

    return (
        <Paper
            elevation={1}
            variant="outlined"
            sx={{
                width: "200px",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "#F9F9F9",
                paddingTop: "10px",
            }}
        >
            <Avatar
                sx={{
                    bgcolor: isConcluida
                        ? theme.palette.success.main
                        : "#E2E5EA",
                    color: isConcluida ? "white" : "black",
                    width: "50px",
                    height: "50px",
                    fontWeight: "bold",
                    fontSize: 16,
                }}
            >
                {etapa}
            </Avatar>

            <Typography
                sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    paddingBottom: "8px",
                }}
            >
                {titulo}
            </Typography>

            <Stack spacing={0}>
                {itens.map((item, i) => (
                    <Box key={i} display="flex" alignItems="center">
                        <Checkbox
                            checked={false}
                            disabled
                            icon={
                                <Box
                                    sx={{
                                        border: "1px solid #ccc",
                                        width: 13,
                                        height: 13,
                                        borderRadius: 1,
                                    }}
                                />
                            }
                            checkedIcon={
                                <CheckCircleOutline
                                    sx={{
                                        fontSize: 18,
                                        color: theme.palette.success.main,
                                    }}
                                />
                            }
                        />
                        <Typography sx={{ fontSize: "13px" }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
