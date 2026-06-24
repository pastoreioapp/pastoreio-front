"use client";

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { StatusTurma } from "@/modules/cursos/domain/status-turma";

const successColor = "#7FB77E";
const primaryColor = "#5B73A8";

export interface CursoCadastro {
    turmaId: number;
    turmaNome: string;
    cursoId: number;
    nome: string;
    status: StatusTurma;
    dataConclusao?: string | null;
    dataInicio?: string | null;
    dataFim?: string | null;
}

interface CursosProps {
    cursosList: CursoCadastro[];
    setCursosList: (novaLista: CursoCadastro[]) => void;
}

function formatDate(value?: string | null): string | null {
    if (!value) return null;

    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

function buildPeriodoLabel(
    dataInicio?: string | null,
    dataFim?: string | null,
): string | null {
    const inicio = formatDate(dataInicio);
    const fim = formatDate(dataFim);

    if (inicio && fim) return `${inicio} - ${fim}`;
    if (inicio) return inicio;
    if (fim) return fim;

    return null;
}

export function Cursos({ cursosList, setCursosList }: CursosProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCourseIndex, setActiveCourseIndex] = useState<number | null>(
        null,
    );
    const [completionDate, setCompletionDate] = useState<Dayjs | null>(null);

    const handleSetStatus = (index: number, status: StatusTurma) => {
        const curso = cursosList[index];

        if (status === StatusTurma.CONCLUIDO) {
            setActiveCourseIndex(index);
            setCompletionDate(
                curso.dataConclusao ? dayjs(curso.dataConclusao) : null,
            );
            setIsModalOpen(true);
            return;
        }

        const novaLista = [...cursosList];

        novaLista[index] = {
            ...curso,
            status,
            dataConclusao: null,
        };

        setCursosList(novaLista);
    };

    const handleConfirm = () => {
        if (activeCourseIndex !== null && completionDate) {
            const novaLista = [...cursosList];

            novaLista[activeCourseIndex] = {
                ...novaLista[activeCourseIndex],
                status: StatusTurma.CONCLUIDO,
                dataConclusao: completionDate.format("YYYY-MM-DD"),
            };

            setCursosList(novaLista);
        }

        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setActiveCourseIndex(null);
        setCompletionDate(null);
    };

    return (
        <Box sx={{ px: 6.5, pb: 4, pt: "40px" }}>
            <Grid container spacing={2}>
                {cursosList.map((curso, index) => (
                    <Grid item xs={12} sm={6} md={4} key={curso.turmaId}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                minHeight: 112,
                                borderRadius: "12px",
                                backgroundColor: "#F2F4F7",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.25,
                                transition: "0.2s",
                                "&:hover": {
                                    backgroundColor: "#ECEEF2",
                                },
                            }}
                        >
                            <Typography
                                title={curso.nome}
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    color: "#191C1E",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {curso.nome}
                            </Typography>

                            <Typography
                                title={curso.turmaNome}
                                sx={{
                                    fontSize: "12px",
                                    color: "#667085",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <span style={{ fontWeight: 900 }}>
                                    Turma:
                                </span>{" "}
                                {curso.turmaNome}
                            </Typography>

                            {buildPeriodoLabel(
                                curso.dataInicio,
                                curso.dataFim,
                            ) && (
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            color: "#667085",
                                        }}
                                    >
                                        <span style={{ fontWeight: 900 }}>
                                            Período da turma:{" "}
                                        </span>
                                        {buildPeriodoLabel(
                                            curso.dataInicio,
                                            curso.dataFim,
                                        )}
                                    </Typography>
                                )}

                            <Box
                                display="flex"
                                gap={1}
                                mt="auto"
                                flexWrap="wrap"
                            >
                                <Button
                                    size="small"
                                    variant={
                                        curso.status ===
                                            StatusTurma.NAO_INICIADO
                                            ? "contained"
                                            : "outlined"
                                    }
                                    onClick={() =>
                                        handleSetStatus(
                                            index,
                                            StatusTurma.NAO_INICIADO,
                                        )
                                    }
                                    sx={{
                                        textTransform: "none",
                                        fontSize: "11px",
                                        minWidth: "auto",
                                        boxShadow: "none",
                                        borderRadius: 2,
                                    }}
                                >
                                    Não iniciado
                                </Button>

                                <Button
                                    size="small"
                                    variant={
                                        curso.status ===
                                            StatusTurma.EM_ANDAMENTO
                                            ? "contained"
                                            : "outlined"
                                    }
                                    onClick={() =>
                                        handleSetStatus(
                                            index,
                                            StatusTurma.EM_ANDAMENTO,
                                        )
                                    }
                                    sx={{
                                        textTransform: "none",
                                        fontSize: "11px",
                                        minWidth: "auto",
                                        boxShadow: "none",
                                        borderRadius: 2,
                                        bgcolor:
                                            curso.status ===
                                                StatusTurma.EM_ANDAMENTO
                                                ? "#F59E0B"
                                                : undefined,
                                        "&:hover": {
                                            bgcolor:
                                                curso.status ===
                                                    StatusTurma.EM_ANDAMENTO
                                                    ? "#D97706"
                                                    : undefined,
                                        },
                                    }}
                                >
                                    Em andamento
                                </Button>

                                <Button
                                    size="small"
                                    variant={
                                        curso.status === StatusTurma.CONCLUIDO
                                            ? "contained"
                                            : "outlined"
                                    }
                                    onClick={() =>
                                        handleSetStatus(
                                            index,
                                            StatusTurma.CONCLUIDO,
                                        )
                                    }
                                    sx={{
                                        textTransform: "none",
                                        fontSize: "11px",
                                        minWidth: "auto",
                                        boxShadow: "none",
                                        borderRadius: 2,
                                        bgcolor:
                                            curso.status ===
                                                StatusTurma.CONCLUIDO
                                                ? successColor
                                                : undefined,
                                        "&:hover": {
                                            bgcolor:
                                                curso.status ===
                                                    StatusTurma.CONCLUIDO
                                                    ? "#6AA66A"
                                                    : undefined,
                                        },
                                    }}
                                >
                                    Concluído
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                maxWidth="xs"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 3,
                        p: 1,
                    },
                }}
            >
                <DialogContent>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        color="#1F2937"
                        mb={1}
                    >
                        Confirmar Conclusão
                    </Typography>

                    <Typography variant="body2" color="#6B7280" mb={3}>
                        Informe a data em que o curso foi concluído.
                    </Typography>

                    <Box mb={4}>
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "#4B5563",
                                mb: 1,
                            }}
                        >
                            Data de Conclusão
                        </Typography>

                        <DatePicker
                            format="DD/MM/YYYY"
                            value={completionDate}
                            onChange={(newValue) => setCompletionDate(newValue)}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                    placeholder: "DD/MM/AAAA",
                                    sx: {
                                        "& .MuiInputBase-root, & .MuiOutlinedInput-root, & .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root":
                                        {
                                            backgroundColor: "#F4F6F8",
                                            borderRadius: "8px",
                                            minHeight: "48px",
                                            height: "48px",
                                            padding: "5px",
                                            alignItems: "center",
                                        },

                                        "& .MuiInputBase-input": {
                                            color: "#1F2937",
                                            padding: "0 14px 0 16px",
                                            height: "100%",
                                            boxSizing: "border-box",

                                            "&::placeholder": {
                                                color: "#9CA3AF",
                                                opacity: 1,
                                            },
                                        },

                                        "& .MuiPickersInputBase-sectionsContainer":
                                        {
                                            color: "#1F2937",
                                            padding: "0 14px 0 16px",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            ml: 1.5,
                                        },

                                        "& .MuiPickersSectionList-root": {
                                            padding: 0,
                                        },

                                        "& .MuiIconButton-root": {
                                            color: "#6B7280",
                                            padding: "6px",
                                            mr: 0.5,
                                        },
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            onClick={handleCloseModal}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                color: "#4B5563",
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleConfirm}
                            disabled={!completionDate}
                            variant="contained"
                            sx={{
                                backgroundColor: primaryColor,
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#475D8C",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Confirmar
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}