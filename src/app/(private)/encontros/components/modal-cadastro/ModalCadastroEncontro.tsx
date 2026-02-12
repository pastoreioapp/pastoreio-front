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
import { enqueueSnackbar } from "notistack";

interface ModalCadastroEncontroProps {
    open: boolean;
    onClose: () => void;
    onSave: (dados: DadosEncontro) => Promise<void>;
}

export interface DadosEncontro {
    celula_id?: string | null;
    tema: string;
    data: string;
    anfitriao: string;
    preletor: string;
    supervisao: "sim" | "não";
    conversoes: "sim" | "não";
    observacoes?: string;
}

export function ModalCadastroEncontro({
    open,
    onClose,
    onSave,
}: ModalCadastroEncontroProps) {
    type CampoObrigatorio = "tema" | "data" | "anfitriao" | "preletor";

    const [dados, setDados] = useState<DadosEncontro>({
        celula_id: null,
        tema: "",
        data: "",
        anfitriao: "",
        preletor: "",
        supervisao: "não",
        conversoes: "não",
        observacoes: "",
    });

    const [salvando, setSalvando] = useState(false);
    const [camposTocados, setCamposTocados] = useState<Record<CampoObrigatorio, boolean>>({
        tema: false,
        data: false,
        anfitriao: false,
        preletor: false,
    });

    const getCampoObrigatorioErro = (campo: CampoObrigatorio) => {
        if (!camposTocados[campo]) {
            return "";
        }

        return dados[campo].trim() ? "" : "Campo obrigatório";
    };

    const marcarCampoComoTocado = (campo: CampoObrigatorio) => {
        setCamposTocados((prev) => ({ ...prev, [campo]: true }));
    };

    const marcarTodosCamposObrigatoriosComoTocados = () => {
        setCamposTocados({
            tema: true,
            data: true,
            anfitriao: true,
            preletor: true,
        });
    };

    const possuiCamposObrigatoriosInvalidos = () =>
        !dados.tema.trim() || !dados.data.trim() || !dados.anfitriao.trim() || !dados.preletor.trim();

    const handleChange = (field: keyof DadosEncontro, value: string) => {
        setDados((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        marcarTodosCamposObrigatoriosComoTocados();

        if (possuiCamposObrigatoriosInvalidos()) {
            const errorMessage = "Por favor, preencha todos os campos obrigatórios";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return;
        }
        
        try {
            setSalvando(true);
            await onSave(dados);
            handleClose();
        } catch (error: any) {
            console.error("Erro ao salvar:", error);
            const errorMessage =
                error?.message || "Não foi possível salvar o encontro. Tente novamente.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            setSalvando(false);
        }
    };

    const handleClose = () => {
        // Limpa o formulário ao fechar
        setDados({
            celula_id: null,
            tema: "",
            data: "",
            anfitriao: "",
            preletor: "",
            supervisao: "não",
            conversoes: "não",
            observacoes: "",
        });
        setCamposTocados({
            tema: false,
            data: false,
            anfitriao: false,
            preletor: false,
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
                        onBlur={() => marcarCampoComoTocado("tema")}
                        error={Boolean(getCampoObrigatorioErro("tema"))}
                        helperText={getCampoObrigatorioErro("tema")}
                        placeholder="Ex: A Importância da Comunhão"
                    />

                    <TextField
                        label="Data"
                        type="date"
                        fullWidth
                        required
                        value={dados.data}
                        onChange={(e) => handleChange("data", e.target.value)}
                        onBlur={() => marcarCampoComoTocado("data")}
                        error={Boolean(getCampoObrigatorioErro("data"))}
                        helperText={getCampoObrigatorioErro("data")}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Anfitrião"
                        fullWidth
                        required
                        value={dados.anfitriao}
                        onChange={(e) => handleChange("anfitriao", e.target.value)}
                        onBlur={() => marcarCampoComoTocado("anfitriao")}
                        error={Boolean(getCampoObrigatorioErro("anfitriao"))}
                        helperText={getCampoObrigatorioErro("anfitriao")}
                        placeholder="Nome do anfitrião"
                    />

                    <TextField
                        label="Preletor (quem levou a palavra)"
                        fullWidth
                        required
                        value={dados.preletor}
                        onChange={(e) => handleChange("preletor", e.target.value)}
                        onBlur={() => marcarCampoComoTocado("preletor")}
                        error={Boolean(getCampoObrigatorioErro("preletor"))}
                        helperText={getCampoObrigatorioErro("preletor")}
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

                    <TextField
                        label="Observações"
                        fullWidth
                        multiline
                        rows={3}
                        value={dados.observacoes || ""}
                        onChange={(e) => handleChange("observacoes", e.target.value)}
                        placeholder="Observações sobre o encontro (opcional)"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} color="inherit" disabled={salvando}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ bgcolor: "#5E79B3" }}
                    disabled={salvando}
                >
                    {salvando ? "Salvando..." : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
