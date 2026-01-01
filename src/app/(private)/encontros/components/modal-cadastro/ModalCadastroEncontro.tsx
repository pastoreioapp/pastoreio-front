"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import { useState } from "react";

interface ModalCadastroEncontroProps {
    open: boolean;
    onClose: () => void;
    onSave: (dados: DadosEncontro) => void;
}

export interface DadosEncontro {
    tema: string;
    data: string;
    anfitriao: string;
    preletor: string;
    supervisao: "sim" | "não";
    conversoes: "sim" | "não";
}

export function ModalCadastroEncontro({
    open,
    onClose,
    onSave,
}: ModalCadastroEncontroProps) {
    const [dados, setDados] = useState<DadosEncontro>({
        tema: "",
        data: "",
        anfitriao: "",
        preletor: "",
        supervisao: "não",
        conversoes: "não",
    });

    const handleChange = (field: keyof DadosEncontro, value: string) => {
        setDados((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Validação simples
        if (!dados.tema || !dados.data || !dados.anfitriao || !dados.preletor) {
            alert("Por favor, preencha todos os campos obrigatórios");
            return;
        }
        onSave(dados);
        handleClose();
    };

    const handleClose = () => {
        // Limpa o formulário ao fechar
        setDados({
            tema: "",
            data: "",
            anfitriao: "",
            preletor: "",
            supervisao: "não",
            conversoes: "não",
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h5" fontWeight={600}>
                    Registrar Encontro
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    <TextField
                        label="Tema do Encontro"
                        fullWidth
                        required
                        value={dados.tema}
                        onChange={(e) => handleChange("tema", e.target.value)}
                        placeholder="Ex: A Importância da Comunhão"
                    />

                    <TextField
                        label="Data"
                        type="date"
                        fullWidth
                        required
                        value={dados.data}
                        onChange={(e) => handleChange("data", e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Anfitrião"
                        fullWidth
                        required
                        value={dados.anfitriao}
                        onChange={(e) => handleChange("anfitriao", e.target.value)}
                        placeholder="Nome do anfitrião"
                    />

                    <TextField
                        label="Preletor (quem levou a palavra)"
                        fullWidth
                        required
                        value={dados.preletor}
                        onChange={(e) => handleChange("preletor", e.target.value)}
                        placeholder="Nome do preletor"
                    />

                    <FormControl fullWidth>
                        <InputLabel>Houve supervisão do setor?</InputLabel>
                        <Select
                            value={dados.supervisao}
                            label="Houve supervisão do setor?"
                            onChange={(e) =>
                                handleChange("supervisao", e.target.value as "sim" | "não")
                            }
                        >
                            <MenuItem value="não">Não</MenuItem>
                            <MenuItem value="sim">Sim</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Houve conversões?</InputLabel>
                        <Select
                            value={dados.conversoes}
                            label="Houve conversões?"
                            onChange={(e) =>
                                handleChange("conversoes", e.target.value as "sim" | "não")
                            }
                        >
                            <MenuItem value="não">Não</MenuItem>
                            <MenuItem value="sim">Sim</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} color="inherit">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ bgcolor: "#5E79B3" }}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
