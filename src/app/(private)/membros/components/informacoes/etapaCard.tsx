import { CheckCircle } from "@mui/icons-material";
import { Box, Checkbox, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconCheck } from "@tabler/icons-react";

function AnelProgresso({
    valor,
    etapa,
    concluida,
}: {
    valor: number;
    etapa: number;
    concluida: boolean;
}) {
    const theme = useTheme();
    const cor = concluida ? theme.palette.success.main : theme.palette.primary.main;

    return (
        <Box sx={{ position: "relative", display: "inline-flex", mb: 1.5 }}>
            <CircularProgress
                variant="determinate"
                value={100}
                size={56}
                thickness={3}
                sx={{ color: "#EAEEF2", position: "absolute" }}
            />
            <CircularProgress
                variant="determinate"
                value={valor}
                size={56}
                thickness={3}
                sx={{
                    color: cor,
                    "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                        transition: "stroke-dashoffset 0.6s ease",
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {concluida ? (
                    <IconCheck size={22} stroke={2.5} color={cor} />
                ) : (
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {etapa}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export function EtapaCard({
    etapa,
    titulo,
    itens,
    exibirEtapa = true,
}: {
    etapa: number;
    titulo: string;
    itens: { label: string; concluido: boolean }[];
    exibirEtapa?: boolean;
}) {
    const theme = useTheme();
    const totalConcluidos = itens.filter((item) => item.concluido).length;
    const isConcluida = itens.length > 0 && totalConcluidos === itens.length;
    const progresso = itens.length > 0 ? (totalConcluidos / itens.length) * 100 : 0;

    return (
        <Paper
            variant="outlined"
            sx={{
                width: { xs: "100%", sm: "250px" },
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: isConcluida ? "#F1F8F1" : "#FAFBFC",
                border: isConcluida ? "2px solid" : "1px solid",
                borderColor: isConcluida ? "#7fb77e4d" : "divider",
                p: 3,
                transition: "border-color 0.3s, background-color 0.3s",
            }}
        >
            {exibirEtapa && (
                <AnelProgresso valor={progresso} etapa={etapa} concluida={isConcluida} />
            )}

            <Typography
                sx={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 0.25,
                }}
            >
                {titulo}
            </Typography>

            <Typography
                sx={{
                    fontSize: "0.7rem",
                    fontWeight: isConcluida ? 800 : 500,
                    color: isConcluida
                        ? theme.palette.success.main
                        : theme.palette.text.secondary,
                    mb: 2,
                }}
            >
                {isConcluida
                    ? "Concluída"
                    : `${totalConcluidos} de ${itens.length} concluídos`}
            </Typography>

            <Stack spacing={0} sx={{ width: "100%" }}>
                {itens.map((item, i) => (
                    <Box
                        key={i}
                        display="flex"
                        alignItems="center"
                        sx={{
                            py: 0.25,
                            borderRadius: 1,
                        }}
                    >
                        <Checkbox
                            checked={item.concluido}
                            disabled
                            size="small"
                            icon={
                                <Box
                                    sx={{
                                        border: "1.5px solid",
                                        borderColor: "#C5C5C5",
                                        width: 16,
                                        height: 16,
                                        borderRadius: "4px",
                                    }}
                                />
                            }
                            checkedIcon={
                                <CheckCircle
                                    sx={{
                                        fontSize: "1.25rem",
                                        color: theme.palette.success.main,
                                    }}
                                />
                            }
                            sx={{ p: 0.5 }}
                        />
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                color: item.concluido
                                    ? theme.palette.text.secondary
                                    : theme.palette.text.primary,
                                textDecoration: item.concluido ? "line-through" : "none",
                                ml: 0.5,
                            }}
                        >
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
