import { Box, Button, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconBook, IconCalendar } from "@tabler/icons-react";
import { StatusTurma } from "@/modules/cursos/domain/status-turma";

type Props = {
    inscricaoId: number;
    cursoNome: string;
    turmaNome: string;
    status: string;
    statusLabel: string;
    dataInicio: string | null;
    dataFim: string | null;
    concluidoEm: string | null;
    podeRegistrarAvancos?: boolean;
    registrando?: boolean;
    onMarcarConcluido?: (inscricaoId: number) => void;
};

function getStatusChipColor(status: string): "default" | "warning" | "success" {
    switch (status) {
        case StatusTurma.EM_ANDAMENTO:
            return "warning";
        case StatusTurma.CONCLUIDO:
            return "success";
        default:
            return "default";
    }
}

function formatDate(value: string | null): string | null {
    if (!value) return null;
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

export function CursoCard({
    inscricaoId,
    cursoNome,
    turmaNome,
    status,
    statusLabel,
    dataInicio,
    dataFim,
    concluidoEm,
    podeRegistrarAvancos = false,
    registrando = false,
    onMarcarConcluido,
}: Props) {
    const theme = useTheme();
    const concluido = !!concluidoEm;
    const chipColor = concluido ? "success" : getStatusChipColor(status);
    const chipLabel = concluido ? "Concluído" : statusLabel;
    const periodoLabel = buildPeriodoLabel(dataInicio, dataFim);

    return (
        <Paper
            elevation={1}
            variant="outlined"
            sx={{
                width: { xs: "100%", sm: "250px" },
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                bgcolor: concluido ? "#F1F8F1" : "#F9F9F9",
                p: 3,
                gap: 1.5,
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <IconBook size={20} color={theme.palette.text.secondary} />
                <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
                    {cursoNome}
                </Typography>
            </Box>

            <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                Turma: {turmaNome}
            </Typography>

            <Chip
                label={chipLabel}
                color={chipColor}
                size="small"
                sx={{ alignSelf: "flex-start", fontWeight: 500 }}
            />

            {periodoLabel && (
                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                    <IconCalendar size={16} color={theme.palette.text.secondary} />
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                        {periodoLabel}
                    </Typography>
                </Box>
            )}

            {concluidoEm && (
                <Typography sx={{ fontSize: "0.8rem", color: "success.main" }}>
                    Concluído em {formatDate(concluidoEm)}
                </Typography>
            )}

            {podeRegistrarAvancos && !concluido && onMarcarConcluido && (
                <Button
                    variant="outlined"
                    size="small"
                    disabled={registrando}
                    onClick={() => onMarcarConcluido(inscricaoId)}
                    sx={{
                        mt: 0.5,
                        textTransform: "none",
                        borderColor: "#5E79B3",
                        color: "#5E79B3",
                    }}
                >
                    {registrando ? (
                        <CircularProgress size={16} sx={{ color: "#5E79B3" }} />
                    ) : (
                        "Marcar como concluído"
                    )}
                </Button>
            )}
        </Paper>
    );
}

function buildPeriodoLabel(dataInicio: string | null, dataFim: string | null): string | null {
    const inicio = formatDate(dataInicio);
    const fim = formatDate(dataFim);
    if (inicio && fim) return `${inicio} - ${fim}`;
    if (inicio) return `Início: ${inicio}`;
    if (fim) return `Fim: ${fim}`;
    return null;
}
