"use client";

import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
    Paper,
    Dialog,
    DialogContent,
    Button,
} from "@mui/material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

const successColor = "#7FB77E";

export const cursosIniciais = [
    {
        nome: "Panorama Bíblico do Novo Testamento",
        status: "A fazer",
        ano: undefined as string | undefined,
    },
    { nome: "Curso Nova Criatura", status: "Concluído", ano: "2021" },
    { nome: "Vida Devocional", status: "Concluído", ano: "2021" },
    { nome: "Família Cristã", status: "A fazer", ano: undefined },
    { nome: "Ide e Fazei Discípulos", status: "Concluído", ano: "2021" },
    { nome: "Autoridade e Submissão", status: "A fazer", ano: undefined },
    { nome: "Carta aos Romanos", status: "Concluído", ano: "2021" },
    { nome: "Mordomia e Finanças", status: "A fazer", ano: undefined },
    { nome: "TLC", status: "A fazer", ano: undefined },
    { nome: "Maturidade Cristã", status: "A fazer", ano: undefined },
    { nome: "Escatologia", status: "A fazer", ano: undefined },
    {
        nome: "Panorama do Antigo Testamento",
        status: "A fazer",
        ano: undefined,
    },
];

interface CursosProps {
    cursosList: typeof cursosIniciais;
    setCursosList: (novaLista: typeof cursosIniciais) => void;
}

export function Cursos({ cursosList, setCursosList }: CursosProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCourseIndex, setActiveCourseIndex] = useState<number | null>(
        null,
    );
    const [completionDate, setCompletionDate] = useState<Dayjs | null>(null);

    const handleToggle = (index: number) => {
        const curso = cursosList[index];

        if (curso.status === "A fazer") {
            setActiveCourseIndex(index);
            setCompletionDate(null);
            setIsModalOpen(true);
        } else {
            const novaLista = [...cursosList];
            novaLista[index] = { ...curso, status: "A fazer", ano: undefined };
            setCursosList(novaLista);
        }
    };

    const handleConfirm = () => {
        if (activeCourseIndex !== null && completionDate) {
            const novaLista = [...cursosList];
            novaLista[activeCourseIndex] = {
                ...novaLista[activeCourseIndex],
                status: "Concluído",
                ano: completionDate.format("YYYY"),
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
                {cursosList.map((curso, index) => {
                    const isDone = curso.status === "Concluído";
                    return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: "12px",
                                    backgroundColor: "#F2F4F7",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    transition: "0.2s",
                                    "&:hover": { backgroundColor: "#ECEEF2" },
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isDone}
                                            onChange={() => handleToggle(index)}
                                            sx={{
                                                color: "#C4C4C4",
                                                "&.Mui-checked": {
                                                    color: successColor,
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            sx={{
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                color: "#191C1E",
                                            }}
                                        >
                                            {curso.nome}
                                        </Typography>
                                    }
                                />
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            px: 1,
                                            py: "2px",
                                            borderRadius: "6px",
                                            color: isDone
                                                ? successColor
                                                : "#777",
                                            backgroundColor: isDone
                                                ? "#7FB77E20"
                                                : "#00000010",
                                        }}
                                    >
                                        {curso.status}
                                    </Typography>
                                    {curso.ano && (
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                color: "#666",
                                            }}
                                        >
                                            {curso.ano}
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                maxWidth="xs"
                fullWidth
                sx={{ "& .MuiDialog-paper": { borderRadius: 3, p: 1 } }}
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
                                    placeholder: "mm/dd/yyyy",
                                    sx: {
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
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
                                backgroundColor: "#5B73A8",
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
