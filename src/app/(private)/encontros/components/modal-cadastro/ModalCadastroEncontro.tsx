"use client";

import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
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
    IconButton,
    Chip,
    InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
    IconX,
    IconUsersGroup,
    IconAlertCircleFilled,
} from "@tabler/icons-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { enqueueSnackbar } from "notistack";
import { listMembrosDaCelula, listMembrosDaCelulaParaData } from "@/app/actions/celulas";
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
    stepInicial?: 0 | 1;
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

const SITUACAO_CONFIG: Record<
    SituacaoFrequencia,
    { label: string; cor: string; bgCor: string }
> = {
    presente: {
        label: "Presente",
        cor: "#16A34A",
        bgCor: "rgba(22, 163, 74, 0.1)",
    },
    justificado: {
        label: "Justif.",
        cor: "#F59E0B",
        bgCor: "rgba(245, 158, 11, 0.1)",
    },
    faltou: {
        label: "Faltou",
        cor: "#EF4444",
        bgCor: "rgba(239, 68, 68, 0.1)",
    },
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#F8F8F8",
        borderRadius: 2,
        "& fieldset": { borderColor: "#F5F5F5" },
        "&:hover fieldset": { borderColor: "#E0E0E0" },
        "&.Mui-focused fieldset": { borderColor: "#5E79B3" },
        "& .MuiInputBase-input::placeholder": {
            color: "#929EAE",
            opacity: 1,
            fontSize: ".9rem",
        },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#5E79B3" },
} as const;

const toggleSimNaoSx = {
    "& .MuiToggleButton-root": {
        borderColor: "#ECECEC",
        color: "text.secondary",
        fontWeight: 600,
        textTransform: "none",
        py: 1,
        "&.Mui-selected": {
            bgcolor: "rgba(94, 121, 179, 0.1)",
            color: "#5E79B3",
            borderColor: "#5E79B3",
            "&:hover": { bgcolor: "rgba(94, 121, 179, 0.15)" },
        },
    },
} as const;

export function ModalCadastroEncontro({
    open,
    onClose,
    onSave,
    dadosIniciais,
    encontroId,
    celulaId,
    frequenciasExistentes,
    stepInicial = 0,
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
    const [buscaMembro, setBuscaMembro] = useState("");

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
            setBuscaMembro("");
        }

        setActiveStep(stepInicial);

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
    }, [open, celulaId, encontroId, stepInicial]);

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

    const handleProximo = async () => {
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

        try {
            setLoadingMembros(true);
            setErroMembros(null);
            setActiveStep(1);
            const list = await listMembrosDaCelulaParaData(celulaId, dados.data);
            setMembros(list);
            setFrequenciaForm(buildFrequenciaFormInicial(list, frequenciasRef.current));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Erro ao carregar membros da célula.";
            setErroMembros(msg);
            setMembros([]);
            setFrequenciaForm({});
        } finally {
            setLoadingMembros(false);
        }
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
        setBuscaMembro("");
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

    const membrosVisiveis = useMemo(() => {
        const termo = buscaMembro.trim().toLowerCase();
        if (!termo) return membros;
        return membros.filter((m) =>
            (m.nome ?? `#${m.id}`).toLowerCase().includes(termo)
        );
    }, [membros, buscaMembro]);

    const tituloModal = encontroId ? "Editar Encontro" : "Registrar Encontro";
    const subtituloModal = `Etapa ${activeStep + 1} de 2 · ${steps[activeStep]}`;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
        >
            <Box
                sx={{
                    background: "linear-gradient(135deg, #4A6499 0%, #5E79B3 40%, #7B95CC 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: { xs: 2, md: 3 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: "#fff",
                            fontSize: { xs: "1.05rem", md: "1.15rem" },
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        {tituloModal}
                    </Typography>
                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "0.8rem",
                            mt: 0.25,
                        }}
                    >
                        {subtituloModal}
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    aria-label="Fechar"
                    sx={{
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                    }}
                >
                    <IconX size={20} />
                </IconButton>
            </Box>

            <Box
                sx={{
                    bgcolor: "#fff",
                    borderBottom: "1px solid #ECECEC",
                    px: { xs: 3, md: 4 },
                    py: 2,
                }}
            >
                <Stepper
                    activeStep={activeStep}
                    sx={{
                        "& .MuiStepLabel-label": {
                            color: "text.secondary",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            "&.Mui-active": { color: "#5E79B3", fontWeight: 600 },
                            "&.Mui-completed": { color: "#5E79B3", fontWeight: 600 },
                        },
                        "& .MuiStepIcon-root": {
                            color: "#ECECEC",
                            "&.Mui-active": { color: "#5E79B3" },
                            "&.Mui-completed": { color: "#5E79B3" },
                        },
                        "& .MuiStepConnector-line": {
                            borderColor: "#ECECEC",
                        },
                        "& .Mui-active .MuiStepConnector-line, & .Mui-completed .MuiStepConnector-line":
                            {
                                borderColor: "#5E79B3",
                            },
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <DialogContent sx={{ px: { xs: 2.5, md: 4 }, py: 3 }}>
                {activeStep === 0 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <InformacoesGroup titulo="Sobre o encontro">
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                                    sx={inputSx}
                                />
                                <TextField
                                    label="Observações"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={dados.observacoes || ""}
                                    onChange={(e) => handleChange("observacoes", e.target.value)}
                                    placeholder="Observações sobre o encontro (opcional)"
                                    sx={inputSx}
                                />
                            </Box>
                        </InformacoesGroup>

                        <InformacoesGroup titulo="Quando e onde">
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                        gap: 2,
                                    }}
                                >
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
                                        sx={inputSx}
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
                                        sx={inputSx}
                                    />
                                </Box>
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
                                    sx={inputSx}
                                />
                            </Box>
                        </InformacoesGroup>

                        <InformacoesGroup titulo="Pessoas">
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 2,
                                }}
                            >
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
                                    sx={inputSx}
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
                                    sx={inputSx}
                                />
                            </Box>
                        </InformacoesGroup>

                        <InformacoesGroup titulo="Indicadores">
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.78rem",
                                            color: "text.secondary",
                                            fontWeight: 600,
                                            mb: 1,
                                        }}
                                    >
                                        Houve supervisão do setor?
                                    </Typography>
                                    <ToggleButtonGroup
                                        exclusive
                                        value={dados.supervisao}
                                        onChange={(_, v) => {
                                            if (v) handleChange("supervisao", v);
                                        }}
                                        fullWidth
                                        sx={toggleSimNaoSx}
                                    >
                                        <ToggleButton value="não">Não</ToggleButton>
                                        <ToggleButton value="sim">Sim</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.78rem",
                                            color: "text.secondary",
                                            fontWeight: 600,
                                            mb: 1,
                                        }}
                                    >
                                        Houve conversões?
                                    </Typography>
                                    <ToggleButtonGroup
                                        exclusive
                                        value={dados.conversoes}
                                        onChange={(_, v) => {
                                            if (v) handleChange("conversoes", v);
                                        }}
                                        fullWidth
                                        sx={toggleSimNaoSx}
                                    >
                                        <ToggleButton value="não">Não</ToggleButton>
                                        <ToggleButton value="sim">Sim</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Box>
                        </InformacoesGroup>
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box>
                        {loadingMembros ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                gap={1.5}
                                py={6}
                            >
                                <CircularProgress size={32} sx={{ color: "#5E79B3" }} />
                                <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                                    Carregando membros...
                                </Typography>
                            </Box>
                        ) : erroMembros ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1.5,
                                    bgcolor: "rgba(239,68,68,0.08)",
                                    border: "1px solid rgba(239,68,68,0.2)",
                                    borderRadius: 2,
                                    p: 2,
                                }}
                            >
                                <Box sx={{ color: "#EF4444", display: "flex", mt: "2px" }}>
                                    <IconAlertCircleFilled size={18} />
                                </Box>
                                <Typography sx={{ color: "#B91C1C", fontSize: "0.9rem" }}>
                                    {erroMembros}
                                </Typography>
                            </Box>
                        ) : membros.length === 0 ? (
                            <Box
                                sx={{
                                    border: "2px dashed #DEE3EA",
                                    borderRadius: 3,
                                    py: 6,
                                    px: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1.5,
                                }}
                            >
                                <IconUsersGroup size={48} stroke={1.5} color="#5A6A85" />
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "16px",
                                        textAlign: "center",
                                    }}
                                >
                                    Não há membros vinculados a esta célula para lançar frequência.
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 0.75,
                                        flexWrap: "wrap",
                                        mb: 1.5,
                                    }}
                                >
                                    <AcaoMassaChip
                                        label="Marcar todos presentes"
                                        cor={SITUACAO_CONFIG.presente.cor}
                                        onClick={() => marcarTodos("presente")}
                                    />
                                    <AcaoMassaChip
                                        label="Marcar todos justificados"
                                        cor={SITUACAO_CONFIG.justificado.cor}
                                        onClick={() => marcarTodos("justificado")}
                                    />
                                    <AcaoMassaChip
                                        label="Marcar todos faltaram"
                                        cor={SITUACAO_CONFIG.faltou.cor}
                                        onClick={() => marcarTodos("faltou")}
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        aria-label="Pesquisar membro"
                                        variant="outlined"
                                        placeholder="Pesquisar membro"
                                        value={buscaMembro}
                                        onChange={(e) => setBuscaMembro(e.target.value)}
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                height: "40px",
                                                backgroundColor: "#F8F8F8",
                                                borderRadius: 2,
                                                "& fieldset": { borderColor: "#F5F5F5" },
                                                "&:hover fieldset": { borderColor: "#E0E0E0" },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#5E79B3",
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    color: "#929EAE",
                                                    opacity: 1,
                                                    fontSize: ".9rem",
                                                },
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search
                                                        sx={{
                                                            width: 22,
                                                            height: 22,
                                                            color: "#929EAE",
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                <TableContainer
                                    component={Paper}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 3,
                                        borderColor: "#ECECEC",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    bgcolor: "#FAFBFC",
                                                    "& .MuiTableCell-root": {
                                                        fontSize: "0.72rem",
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.04em",
                                                        color: "text.secondary",
                                                        borderBottom: "1px solid #ECECEC",
                                                    },
                                                }}
                                            >
                                                <TableCell>Membro</TableCell>
                                                <TableCell>Situação</TableCell>
                                                <TableCell>Justificativa</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {membrosVisiveis.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        sx={{
                                                            py: 4,
                                                            textAlign: "center",
                                                            color: "text.secondary",
                                                            fontSize: "0.9rem",
                                                            border: "none",
                                                        }}
                                                    >
                                                        Nenhum membro encontrado.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                membrosVisiveis.map((m, index) => {
                                                    const row = frequenciaForm[m.id] ?? {
                                                        situacao: "faltou" as const,
                                                        justificativa: "",
                                                    };
                                                    const isUltimo =
                                                        index === membrosVisiveis.length - 1;
                                                    const nomeExibicao = m.nome ?? `Membro #${m.id}`;
                                                    return (
                                                        <TableRow
                                                            key={m.id}
                                                            sx={{
                                                                transition:
                                                                    "background-color 0.15s ease",
                                                                "&:hover": {
                                                                    bgcolor:
                                                                        "rgba(94, 121, 179, 0.03)",
                                                                },
                                                                "& .MuiTableCell-root": {
                                                                    borderBottom: isUltimo
                                                                        ? "none"
                                                                        : "1px solid #ECECEC",
                                                                },
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "0.95rem",
                                                                        color: "#000",
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    {nomeExibicao}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <SituacaoToggle
                                                                    value={row.situacao}
                                                                    onChange={(v) =>
                                                                        setSituacaoMembro(m.id, v)
                                                                    }
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ minWidth: 200 }}>
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
                                                                        sx={inputSx}
                                                                    />
                                                                ) : (
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: "text.disabled",
                                                                        }}
                                                                    >
                                                                        —
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions
                sx={{
                    borderTop: "1px solid #ECECEC",
                    px: { xs: 2.5, md: 3 },
                    py: 2,
                    gap: 1,
                }}
            >
                <Button
                    onClick={handleClose}
                    color="inherit"
                    disabled={salvando}
                    sx={{ fontWeight: 600, textTransform: "none" }}
                >
                    Cancelar
                </Button>
                {activeStep === 1 && (
                    <Button
                        onClick={() => setActiveStep(0)}
                        color="inherit"
                        disabled={salvando}
                        sx={{ fontWeight: 600, textTransform: "none" }}
                    >
                        Voltar
                    </Button>
                )}
                {activeStep === 0 ? (
                    <Button
                        onClick={handleProximo}
                        variant="contained"
                        disabled={salvando}
                        sx={{
                            bgcolor: "#5E79B3",
                            "&:hover": { bgcolor: "#4A6499" },
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",
                            px: 3,
                        }}
                    >
                        Próximo
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={
                            salvando ||
                            loadingMembros ||
                            Boolean(erroMembros) ||
                            membros.length === 0
                        }
                        sx={{
                            bgcolor: "#5E79B3",
                            "&:hover": { bgcolor: "#4A6499" },
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",
                            px: 3,
                        }}
                    >
                        {salvando ? "Salvando..." : "Salvar"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

function InformacoesGroup({
    titulo,
    children,
}: {
    titulo: string;
    children: React.ReactNode;
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3,
                p: 2.5,
                bgcolor: "#FAFBFC",
                borderColor: "#ECECEC",
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "text.secondary",
                    mb: 2,
                }}
            >
                {titulo}
            </Typography>
            {children}
        </Paper>
    );
}

function AcaoMassaChip({
    label,
    cor,
    onClick,
}: {
    label: string;
    cor: string;
    onClick: () => void;
}) {
    return (
        <Chip
            label={label}
            onClick={onClick}
            size="small"
            sx={{
                fontSize: "0.78rem",
                fontWeight: 600,
                height: 30,
                borderRadius: 999,
                cursor: "pointer",
                bgcolor: "#F5F5F5",
                color: "text.secondary",
                border: "1px solid #ECECEC",
                transition: "all 0.15s ease",
                "&:hover": {
                    bgcolor: cor,
                    color: "#fff",
                    borderColor: cor,
                },
                "& .MuiChip-label": {
                    px: 1.25,
                },
            }}
        />
    );
}

function SituacaoToggle({
    value,
    onChange,
}: {
    value: SituacaoFrequencia;
    onChange: (v: SituacaoFrequencia) => void;
}) {
    const buildSelectedSx = (situacao: SituacaoFrequencia) => {
        const cfg = SITUACAO_CONFIG[situacao];
        return {
            bgcolor: cfg.bgCor,
            color: cfg.cor,
            borderColor: cfg.cor,
            "&:hover": { bgcolor: cfg.bgCor },
        };
    };

    return (
        <ToggleButtonGroup
            exclusive
            size="small"
            value={value}
            onChange={(_, v) => {
                if (v != null) onChange(v as SituacaoFrequencia);
            }}
            sx={{
                "& .MuiToggleButton-root": {
                    borderColor: "#ECECEC",
                    color: "text.secondary",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.75rem",
                    px: 1.25,
                    py: 0.5,
                    "&:hover": {
                        bgcolor: "rgba(94, 121, 179, 0.04)",
                    },
                },
                "& .MuiToggleButton-root[value='presente'].Mui-selected":
                    buildSelectedSx("presente"),
                "& .MuiToggleButton-root[value='justificado'].Mui-selected":
                    buildSelectedSx("justificado"),
                "& .MuiToggleButton-root[value='faltou'].Mui-selected":
                    buildSelectedSx("faltou"),
            }}
        >
            <ToggleButton value="presente">{SITUACAO_CONFIG.presente.label}</ToggleButton>
            <ToggleButton value="justificado">
                {SITUACAO_CONFIG.justificado.label}
            </ToggleButton>
            <ToggleButton value="faltou">{SITUACAO_CONFIG.faltou.label}</ToggleButton>
        </ToggleButtonGroup>
    );
}
