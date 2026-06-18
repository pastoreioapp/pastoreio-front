import { Box, Chip, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconBook } from "@tabler/icons-react";
import { StatusTurma } from "@/modules/cursos/domain/status-turma";

type Props = {
    cursoNome: string;
    turmaNome: string;
    status: string;
    statusLabel: string;
    dataInicio: string | null;
    dataFim: string | null;
    dataConclusao: string | null;
};

function formatDate(value: string | null): string | null {
    if (!value) return null;

    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

function buildPeriodoValue(
    dataInicio: string | null,
    dataFim: string | null,
): string | null {
    const inicio = formatDate(dataInicio);
    const fim = formatDate(dataFim);

    if (inicio && fim) return `${inicio} - ${fim}`;
    if (inicio) return inicio;
    if (fim) return fim;

    return null;
}

function getDateInfo({
    status,
    dataInicio,
    dataFim,
    dataConclusao,
}: {
    status: string;
    dataInicio: string | null;
    dataFim: string | null;
    dataConclusao: string | null;
}): { label: string; value: string } | null {
    if (status === StatusTurma.CONCLUIDO && dataConclusao) {
        const conclusao = formatDate(dataConclusao);

        if (!conclusao) return null;

        return {
            label: "Concluído em:",
            value: conclusao,
        };
    }

    const periodo = buildPeriodoValue(dataInicio, dataFim);

    if (!periodo) return null;

    return {
        label: "Período da turma:",
        value: periodo,
    };
}

function getStatusChipStyle(status: string) {
    if (status === StatusTurma.CONCLUIDO) {
        return {
            color: "#FFFFFF",
            backgroundColor: "#7FB77E",
        };
    }

    if (status === StatusTurma.EM_ANDAMENTO) {
        return {
            color: "#FFFFFF",
            backgroundColor: "#F59E0B",
        };
    }

    return {
        color: "#777777",
        backgroundColor: "#00000010",
    };
}

export function CursoCard({
    cursoNome,
    turmaNome,
    status,
    statusLabel,
    dataInicio,
    dataFim,
    dataConclusao,
}: Props) {
    const theme = useTheme();

    const dateInfo = getDateInfo({
        status,
        dataInicio,
        dataFim,
        dataConclusao,
    });

    const chipStyle = getStatusChipStyle(status);

    return (
        <Paper
            elevation={0}
            sx={{
                width: { xs: "100%", sm: "280px" },
                minHeight: 150,
                borderRadius: "12px",
                backgroundColor: "#F2F4F7",
                display: "flex",
                flexDirection: "column",
                gap: 1.35,
                p: 2,
                transition: "0.2s",
                "&:hover": {
                    backgroundColor: "#ECEEF2",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        pt: "1px",
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                    }}
                >
                    <IconBook size={18} color={theme.palette.text.secondary} />
                </Box>

                <Typography
                    title={cursoNome}
                    sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#191C1E",
                        lineHeight: 1.35,
                        wordBreak: "break-word",
                    }}
                >
                    {cursoNome}
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontSize: "12px",
                    color: "#667085",
                    lineHeight: 1.45,
                    wordBreak: "break-word",
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontSize: "12px",
                        fontWeight: 900,
                        color: "#667085",
                    }}
                >
                    Turma:
                </Typography>{" "}
                {turmaNome}
            </Typography>

            {dateInfo && (
                <Typography
                    sx={{
                        fontSize: "12px",
                        color: "#667085",
                        lineHeight: 1.45,
                        wordBreak: "break-word",
                    }}
                >
                    <Typography
                        component="span"
                        sx={{
                            fontSize: "12px",
                            fontWeight: 900,
                            color: "#667085",
                        }}
                    >
                        {dateInfo.label}
                    </Typography>{" "}
                    {dateInfo.value}
                </Typography>
            )}

            <Box sx={{ mt: "auto", pt: 0.5 }}>
                <Chip
                    label={statusLabel}
                    size="small"
                    sx={{
                        height: 24,
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        px: 0.5,
                        color: chipStyle.color,
                        backgroundColor: chipStyle.backgroundColor,
                        "& .MuiChip-label": {
                            px: 1,
                        },
                    }}
                />
            </Box>
        </Paper>
    );
}
