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
    Stepper,
    Step,
    StepLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { listMembrosDaCelula } from "@/app/actions/celulas";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import type { FrequenciaSyncLinha } from "@/modules/celulas/domain/frequencia-sync";
import {
    buildFrequenciaFormInicial,
    formToSyncLinhas,
    type LinhaFrequenciaForm,
    type SituacaoFrequencia,
} from "./frequencia-form-helpers";

interface ModalCadastroEncontroProps {
    open: boolean;
    onClose: () => void;
    onSave: (payload: {
        dados: DadosEncontro;
        frequencias: FrequenciaSyncLinha[];
    }) => Promise<void>;
    dadosIniciais?: DadosEncontro | null;
    encontroId?: string | null;
    celulaId?: number | null;
    frequenciasExistentes?: Encontro["frequencia"];
}

export interface DadosEncontro {
    celula_id?: string | null;
    tema: string;
    data: string;
    horario: string;
    local: string;
    anfitriao: string;
    preletor: string;
    supervisao: "sim" | "não";
    conversoes: "sim" | "não";
    observacoes?: string;
}

const dadosPadrao: DadosEncontro = {
    celula_id: null,
    tema: "",
    data: "",
    horario: "19:00",
    local: "",
    anfitriao: "",
    preletor: "",
    supervisao: "não",
    conversoes: "não",
    observacoes: "",
};

const steps = ["Dados do encontro", "Frequência"];

export function ModalCadastroEncontro({
    open,
    onClose,
    onSave,
    dadosIniciais,
    encontroId,
    celulaId,
    frequenciasExistentes,
}: ModalCadastroEncontroProps) {
    type CampoObrigatorio = "tema" | "data" | "horario" | "local" | "anfitriao" | "preletor";

    const [activeStep, setActiveStep] = useState(0);
    const [dados, setDados] = useState<DadosEncontro>(dadosIniciais || dadosPadrao);
    const [membros, setMembros] = useState<MembroDaCelulaListItemDto[]>([]);
    const [loadingMembros, setLoadingMembros] = useState(false);
    const [erroMembros, setErroMembros] = useState<string | null>(null);
    const [frequenciaForm, setFrequenciaForm] = useState<
        Record<number, LinhaFrequenciaForm>
    >({});

    const frequenciasRef = useRef(frequenciasExistentes);
    frequenciasRef.current = frequenciasExistentes;

    const [salvando, setSalvando] = useState(false);
    const [camposTocados, setCamposTocados] = useState<Record<CampoObrigatorio, boolean>>({
        tema: false,
        data: false,
        horario: false,
        local: false,
        anfitriao: false,
        preletor: false,
    });

    useEffect(() => {
        setDados(dadosIniciais ?? dadosPadrao);
    }, [dadosIniciais]);

    useEffect(() => {
        if (!open) {
            setActiveStep(0);
            setMembros([]);
            setFrequenciaForm({});
            setErroMembros(null);
            return;
        }

        if (celulaId == null) {
            setMembros([]);
            setFrequenciaForm({});
            setErroMembros(null);
            return;
        }

        let cancelled = false;
        setLoadingMembros(true);
        setErroMembros(null);

        listMembrosDaCelula(celulaId)
            .then((list) => {
                if (cancelled) return;
                setMembros(list);
                setFrequenciaForm(
                    buildFrequenciaFormInicial(list, frequenciasRef.current)
                );
            })
            .catch((e: unknown) => {
                if (cancelled) return;
                const msg =
                    e instanceof Error ? e.message : "Erro ao carregar membros da célula.";
                setErroMembros(msg);
                setMembros([]);
                setFrequenciaForm({});
            })
            .finally(() => {
                if (!cancelled) setLoadingMembros(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, celulaId, encontroId]);

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
            horario: true,
            local: true,
            anfitriao: true,
            preletor: true,
        });
    };

    const possuiCamposObrigatoriosInvalidos = () =>
        !dados.tema.trim() ||
        !dados.data.trim() ||
        !dados.horario.trim() ||
        !dados.local.trim() ||
        !dados.anfitriao.trim() ||
        !dados.preletor.trim();

    const handleChange = (field: keyof DadosEncontro, value: string) => {
        setDados((prev) => ({ ...prev, [field]: value }));
    };

    const handleProximo = () => {
        marcarTodosCamposObrigatoriosComoTocados();

        if (possuiCamposObrigatoriosInvalidos()) {
            enqueueSnackbar("Por favor, preencha todos os campos obrigatórios", {
                variant: "error",
                autoHideDuration: 2000,
            });
            return;
        }

        if (celulaId == null) {
            enqueueSnackbar("Célula não encontrada para lançar frequência.", {
                variant: "error",
                autoHideDuration: 2000,
            });
            return;
        }

        setActiveStep(1);
    };

    const handleSubmit = async () => {
        if (celulaId == null) {
            enqueueSnackbar("Célula não encontrada.", { variant: "error", autoHideDuration: 2000 });
            return;
        }

        for (const m of membros) {
            const row = frequenciaForm[m.id];
            if (row?.situacao === "justificado" && !row.justificativa.trim()) {
                enqueueSnackbar(
                    `Informe a justificativa para ${m.nome ?? "o membro"}.`,
                    { variant: "error", autoHideDuration: 2500 }
                );
                return;
            }
        }

        const frequencias = formToSyncLinhas(membros, frequenciaForm);

        try {
            setSalvando(true);
            await onSave({ dados, frequencias });
            handleClose();
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Não foi possível salvar o encontro. Tente novamente.";
            enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: 2000 });
        } finally {
            setSalvando(false);
        }
    };

    const handleClose = () => {
        setActiveStep(0);
        setDados(dadosPadrao);
        setCamposTocados({
            tema: false,
            data: false,
            horario: false,
            local: false,
            anfitriao: false,
            preletor: false,
        });
        onClose();
    };

    const setSituacaoMembro = (membroId: number, situacao: SituacaoFrequencia) => {
        setFrequenciaForm((prev) => ({
            ...prev,
            [membroId]: {
                situacao,
                justificativa:
                    situacao === "justificado" ? prev[membroId]?.justificativa ?? "" : "",
            },
        }));
    };

    const setJustificativaMembro = (membroId: number, justificativa: string) => {
        setFrequenciaForm((prev) => ({
            ...prev,
            [membroId]: {
                situacao: prev[membroId]?.situacao ?? "justificado",
                justificativa,
            },
        }));
    };

    const marcarTodos = (situacao: SituacaoFrequencia) => {
        setFrequenciaForm((prev) => {
            const next = { ...prev };
            for (const m of membros) {
                next[m.id] = {
                    situacao,
                    justificativa: situacao === "justificado" ? prev[m.id]?.justificativa ?? "" : "",
                };
            }
            return next;
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5" fontWeight={600}>
                    {encontroId ? "Editar Encontro" : "Registrar Encontro"}
                </Typography>
                <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </DialogTitle>
            <DialogContent>
                {activeStep === 0 && (
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
                            label="Horário"
                            type="time"
                            fullWidth
                            required
                            value={dados.horario}
                            onChange={(e) => handleChange("horario", e.target.value)}
                            onBlur={() => marcarCampoComoTocado("horario")}
                            error={Boolean(getCampoObrigatorioErro("horario"))}
                            helperText={getCampoObrigatorioErro("horario")}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Local/Endereço"
                            fullWidth
                            required
                            value={dados.local}
                            onChange={(e) => handleChange("local", e.target.value)}
                            onBlur={() => marcarCampoComoTocado("local")}
                            error={Boolean(getCampoObrigatorioErro("local"))}
                            helperText={getCampoObrigatorioErro("local")}
                            placeholder="Ex: Rua das Flores, 123 - Centro"
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
                )}

                {activeStep === 1 && (
                    <Box sx={{ pt: 2 }}>
                        {loadingMembros ? (
                            <Box display="flex" justifyContent="center" py={4}>
                                <CircularProgress size={32} />
                            </Box>
                        ) : erroMembros ? (
                            <Typography color="error">{erroMembros}</Typography>
                        ) : membros.length === 0 ? (
                            <Typography sx={{ color: "text.secondary" }}>
                                Não há membros vinculados a esta célula para lançar frequência.
                            </Typography>
                        ) : (
                            <>
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                                    <Button size="small" variant="outlined" onClick={() => marcarTodos("presente")}>
                                        Todos presentes
                                    </Button>
                                    <Button size="small" variant="outlined" onClick={() => marcarTodos("faltou")}>
                                        Todos faltaram
                                    </Button>
                                </Box>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Membro</TableCell>
                                                <TableCell>Situação</TableCell>
                                                <TableCell>Justificativa</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {membros.map((m) => {
                                                const row = frequenciaForm[m.id] ?? {
                                                    situacao: "faltou" as const,
                                                    justificativa: "",
                                                };
                                                return (
                                                    <TableRow key={m.id}>
                                                        <TableCell>{m.nome ?? `#${m.id}`}</TableCell>
                                                        <TableCell>
                                                            <ToggleButtonGroup
                                                                exclusive
                                                                size="small"
                                                                value={row.situacao}
                                                                onChange={(_, v) => {
                                                                    if (v != null) setSituacaoMembro(m.id, v);
                                                                }}
                                                            >
                                                                <ToggleButton value="presente">
                                                                    Presente
                                                                </ToggleButton>
                                                                <ToggleButton value="justificado">
                                                                    Justif.
                                                                </ToggleButton>
                                                                <ToggleButton value="faltou">
                                                                    Faltou
                                                                </ToggleButton>
                                                            </ToggleButtonGroup>
                                                        </TableCell>
                                                        <TableCell sx={{ minWidth: 180 }}>
                                                            {row.situacao === "justificado" ? (
                                                                <TextField
                                                                    size="small"
                                                                    fullWidth
                                                                    placeholder="Motivo"
                                                                    value={row.justificativa}
                                                                    onChange={(e) =>
                                                                        setJustificativaMembro(
                                                                            m.id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    —
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} color="inherit" disabled={salvando}>
                    Cancelar
                </Button>
                {activeStep === 1 && (
                    <Button onClick={() => setActiveStep(0)} color="inherit" disabled={salvando}>
                        Voltar
                    </Button>
                )}
                {activeStep === 0 ? (
                    <Button
                        onClick={handleProximo}
                        variant="contained"
                        sx={{ bgcolor: "primary.main" }}
                        disabled={salvando}
                    >
                        Próximo
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ bgcolor: "primary.main" }}
                        disabled={
                            salvando ||
                            loadingMembros ||
                            Boolean(erroMembros) ||
                            membros.length === 0
                        }
                    >
                        {salvando ? "Salvando..." : "Salvar"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
