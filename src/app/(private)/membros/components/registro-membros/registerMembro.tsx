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
import { useState } from "react";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Dados } from "./components/dados";
import { Cursos, cursosIniciais } from "./components/cursos";
import {
    Trajetoria,
    initialFases,
    calculateState,
} from "./components/trajetoria";
import { createMembroFromUI } from "@/app/actions/membros";

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
        cargo: string;
        ministerio: string;
        discipulador: string;
        discipulo: string;
        estadoCivil: string;
        filhos: string;
    };
}

const initialPayload: MembroPayload = {
    dadosPessoais: {
        nome: "",
        nascimento: null,
        email: "",
        telefone: "",
        endereco: "",
        cargo: "Membro",
        ministerio: "",
        discipulador: "",
        discipulo: "",
        estadoCivil: "Solteiro",
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
    const [cursosData, setCursosData] = useState(cursosIniciais);
    const [trajetoriaData, setTrajetoriaData] = useState(() =>
        calculateState(initialFases),
    );

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error" as "error" | "success",
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const handleDadosChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            dadosPessoais: { ...prev.dadosPessoais, [field]: value },
        }));
    };

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
                message: "Por favor, insira um e-mail válido.",
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
            const payloadCompleto = {
                dadosPessoais: formData.dadosPessoais,
                cursos: cursosData,
                trajetoria: trajetoriaData,
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
                setCursosData(cursosIniciais);
                setTrajetoriaData(calculateState(initialFases));
                setTabValue("1");
                onSuccess();
            }, 1000);
        } catch (error: any) {
            console.error("Erro ao salvar membro:", error);
            setSnackbar({
                open: true,
                message:
                    error.message ||
                    "Erro ao salvar os dados. Tente novamente.",
                severity: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseModal = () => {
        if (!isSaving) {
            setFormData(initialPayload);
            setCursosData(cursosIniciais);
            setTrajetoriaData(calculateState(initialFases));
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
                    <Trajetoria
                        fasesList={trajetoriaData}
                        setFasesList={setTrajetoriaData}
                    />
                </TabPanel>
                <TabPanel
                    value="3"
                    sx={{ p: 0, height: "60vh", overflowY: "auto" }}
                >
                    <Cursos
                        cursosList={cursosData}
                        setCursosList={setCursosData}
                    />
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
                        "&:hover": {
                            backgroundColor: "transparent",
                            color: "#1F2937",
                        },
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
                        "&:hover": {
                            backgroundColor: "#314574",
                            boxShadow: "none",
                        },
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
                    onClose={() =>
                        setSnackbar((prev) => ({ ...prev, open: false }))
                    }
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