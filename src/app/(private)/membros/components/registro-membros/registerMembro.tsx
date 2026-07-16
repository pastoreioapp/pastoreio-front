"use client";

import {
    Dialog,
    Typography,
    Box,
    Button,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Dados } from "./components/dados";
import { Cursos } from "./components/cursos";
import {
    Trajetoria,
    calculateState,
    initialFases,
} from "./components/trajetoria";
import { createMembroFromUI } from "@/app/actions/membros";
import { getTrajetoriaAtivaParaCadastro } from "@/app/actions/trajetoria";
import { getCursosAtivosParaCadastro } from "@/app/actions/cursos";
import type { CursoCadastro } from "./components/cursos";
import { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import { StatusTurma } from "@/modules/cursos/domain/status-turma";

interface RegisterMembroProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    celulaId?: number;
}

export interface MembroPayload {
    dadosPessoais: {
        nome: string;
        nascimento: string | null;
        email: string;
        telefone: string;
        endereco: string;
        cargo: PapelCelula;
        ministerio: string;
        discipulador: string;
        discipulo: string;
        estadoCivil: string;
        conjuge: string;
        filhos: string;
    };
}
export interface CursoPayload {
    turmaId: number;
    cursoId: number;
    nome: string;
    turmaNome: string;
    status: StatusTurma;
    ano?: string;
}

const initialPayload: MembroPayload = {
    dadosPessoais: {
        nome: "",
        nascimento: null,
        email: "",
        telefone: "",
        endereco: "",
        cargo: PapelCelula.MEMBRO,
        ministerio: "Nenhum",
        discipulador: "",
        discipulo: "",
        estadoCivil: "Solteiro",
        conjuge: "",
        filhos: "Nao",
    },
};

export function RegisterMembro({
    open,
    onClose,
    onSuccess,
    celulaId,
}: RegisterMembroProps) {
    const [tabValue, setTabValue] = useState("1");
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<MembroPayload>(initialPayload);
    const [cursosData, setCursosData] = useState<CursoCadastro[]>([]);
    const [trajetoriaData, setTrajetoriaData] = useState<any[]>([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error" as "error" | "success",
    });

    useEffect(() => {
        if (open) {
            getTrajetoriaAtivaParaCadastro()
                .then((res) => {
                    if (res && res.grupos && res.grupos.length > 0) {
                        const fasesMapeadas = res.grupos.map((g: any) => ({
                            id: g.ordem || g.id,
                            title: g.nome,
                            items: g.passos
                                ? g.passos.map((p: any) => ({
                                    id: p.id,
                                    label: p.nome,
                                    checked: false,
                                }))
                                : [],
                        }));
                        setTrajetoriaData(calculateState(fasesMapeadas));
                    } else {
                        setTrajetoriaData(calculateState(initialFases));
                    }
                })
                .catch((err) => console.error(err));

            getCursosAtivosParaCadastro()
                .then((res) => {
                    if (res && res.length > 0) {
                        const cursosMapeados: CursoCadastro[] = res.map(
                            (t) => ({
                                turmaId: t.turmaId,
                                cursoId: t.cursoId,
                                nome: t.cursoNome,
                                turmaNome: t.turmaNome,
                                status: StatusTurma.NAO_INICIADO,
                                dataConclusao: null,
                                dataInicio: t.dataInicio,
                                dataFim: t.dataFim,
                            }),
                        );

                        setCursosData(cursosMapeados);
                    } else {
                        setCursosData([]);
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [open]);

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: string,
    ) => setTabValue(newValue);
    const handleDadosChange = (field: string, value: any) =>
        setFormData((prev) => ({
            ...prev,
            dadosPessoais: { ...prev.dadosPessoais, [field]: value },
        }));

    const validateForm = () => {
        const {
            nome,
            nascimento,
            email,
            telefone,
            endereco,
            cargo,
            ministerio,
            discipulador,
            discipulo,
        } = formData.dadosPessoais;
        const requiredFields = [
            { key: nome, name: "Nome" },
            { key: nascimento, name: "Data de Nascimento" },
            { key: email, name: "Email" },
            { key: telefone, name: "Telefone" },
            { key: endereco, name: "Endereço" },
            { key: cargo, name: "Cargo" },
            { key: ministerio, name: "Ministério" },
            { key: discipulador, name: "Discipulador" },
            { key: discipulo, name: "Discípulo" },
        ];

        for (const field of requiredFields) {
            if (!field.key || String(field.key).trim() === "") {
                setSnackbar({
                    open: true,
                    message: `O campo ${field.name} é obrigatório.`,
                    severity: "error",
                });
                setTabValue("1");
                return false;
            }
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setSnackbar({
                open: true,
                message: "E-mail inválido.",
                severity: "error",
            });
            setTabValue("1");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        setIsSaving(true);
        try {
            const passosMarcadosIds = trajetoriaData.flatMap((fase) => {
                if (!fase || !fase.items || !Array.isArray(fase.items)) {
                    return [];
                }
                return fase.items
                    .filter((item: any) => item.checked)
                    .map((item: any) => item.id);
            });

            const cursosSelecionados = cursosData.filter(
                (curso) => curso.status !== StatusTurma.NAO_INICIADO,
            );

            const payloadCompleto = {
                dadosPessoais: formData.dadosPessoais,
                cursos: cursosSelecionados,
                trajetoria: passosMarcadosIds,
            };

            const result = await createMembroFromUI(payloadCompleto, celulaId);

            if (!result.success) throw new Error(result.error);

            setSnackbar({
                open: true,
                message: "Membro salvo com sucesso!",
                severity: "success",
            });

            setTimeout(() => {
                setFormData(initialPayload);
                setCursosData([]);
                setTrajetoriaData([]);
                setTabValue("1");
                onSuccess();
            }, 1000);
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Erro ao salvar.",
                severity: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseModal = () => {
        if (!isSaving) {
            setFormData(initialPayload);
            setCursosData([]);
            setTrajetoriaData([]);
            setTabValue("1");
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseModal}
            fullWidth
            maxWidth="lg"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    color: "#000",
                    overflow: "hidden",
                },
            }}
        >
            <Box display="flex" alignItems="center" pl={"32px"} py={"24px"}>
                <IconButton
                    onClick={handleCloseModal}
                    disabled={isSaving}
                    sx={{ mr: 1, color: "#1F2937" }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" fontWeight={800} color="#1F2937">
                    Membro
                </Typography>
            </Box>
            <TabContext value={tabValue}>
                <Box
                    sx={{
                        borderTop: 1,
                        borderBottom: 1,
                        borderColor: "#c4c6d121",
                        px: 4,
                    }}
                >
                    <TabList
                        onChange={handleTabChange}
                        sx={{ "& .MuiTab-root": { fontWeight: 600 } }}
                    >
                        <Tab label="Dados" value="1" disabled={isSaving} />
                        <Tab label="Trajetória" value="2" disabled={isSaving} />
                        <Tab label="Cursos" value="3" disabled={isSaving} />
                    </TabList>
                </Box>
                <TabPanel
                    value="1"
                    sx={{ p: 0, height: "60vh", overflowY: "auto" }}
                >
                    <Dados
                        data={formData.dadosPessoais}
                        onChange={handleDadosChange}
                    />
                </TabPanel>
                <TabPanel
                    value="2"
                    sx={{ p: 0, height: "60vh", overflowY: "auto" }}
                >
                    {trajetoriaData.length > 0 ? (
                        <Trajetoria
                            fasesList={trajetoriaData}
                            setFasesList={setTrajetoriaData}
                        />
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            <CircularProgress />
                        </Box>
                    )}
                </TabPanel>
                <TabPanel
                    value="3"
                    sx={{ p: 0, height: "60vh", overflowY: "auto" }}
                >
                    {cursosData.length > 0 ? (
                        <Cursos
                            cursosList={cursosData}
                            setCursosList={setCursosData}
                        />
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            <CircularProgress />
                        </Box>
                    )}
                </TabPanel>
            </TabContext>
            <Box
                sx={{
                    backgroundColor: "#F4F6F8",
                    px: 4,
                    py: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    borderTop: "1px solid #E5E7EB",
                }}
            >
                <Button
                    onClick={handleCloseModal}
                    disabled={isSaving}
                    variant="text"
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#4B5563",
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    variant="contained"
                    sx={{
                        backgroundColor: "#425B93",
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        boxShadow: "none",
                    }}
                >
                    {isSaving ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Salvar Alterações"
                    )}
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((prev) => ({ ...prev, open: false }))
                }
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{ width: "100%", fontWeight: 500 }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}