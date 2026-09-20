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
import { createMembroFromUI, updateMembroFromUI } from "@/app/actions/membros";
import {
    getTrajetoriaAtivaParaCadastro,
    getTrajetoriaDoMembro,
} from "@/app/actions/trajetoria";
import {
    getCursosAtivosParaCadastro,
    getCursosDoMembro,
} from "@/app/actions/cursos";
import type { CursoCadastro } from "./components/cursos";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { TrajetoriaDoMembroDto } from "@/modules/trajetoria/application/dtos";
import type {
    CursoDoMembroDto,
    TurmaParaCadastroDto,
} from "@/modules/cursos/application/dtos";
import { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import { parseStatusTurma, StatusTurma } from "@/modules/cursos/domain/status-turma";

interface RegisterMembroProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (membroAtualizado?: Partial<MembroDaCelulaListItemDto>) => void;
    celulaId?: number;
    membro?: MembroDaCelulaListItemDto | null;
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

function fasesFromTrajetoria(trajetoria: TrajetoriaDoMembroDto) {
    return trajetoria.grupos.map((grupo) => ({
        id: grupo.ordem || grupo.id,
        title: grupo.nome,
        items: grupo.passos.map((passo) => ({
            id: passo.id,
            label: passo.nome,
            checked: passo.concluido,
        })),
    }));
}

function mergeCursosCadastro(
    catalogo: TurmaParaCadastroDto[],
    inscricoes: CursoDoMembroDto[],
): CursoCadastro[] {
    const porTurma = new Map(
        inscricoes.map((inscricao) => [inscricao.turmaId, inscricao]),
    );
    const usados = new Set<number>();

    const lista = catalogo.map((turma) => {
        const existente = porTurma.get(turma.turmaId);
        if (existente) usados.add(turma.turmaId);

        return {
            turmaId: turma.turmaId,
            cursoId: turma.cursoId,
            nome: turma.cursoNome,
            turmaNome: turma.turmaNome,
            status: existente
                ? parseStatusTurma(existente.status)
                : StatusTurma.NAO_INICIADO,
            dataConclusao: existente?.dataConclusao ?? null,
            dataInicio: turma.dataInicio,
            dataFim: turma.dataFim,
        };
    });

    for (const inscricao of inscricoes) {
        if (usados.has(inscricao.turmaId)) continue;
        lista.push({
            turmaId: inscricao.turmaId,
            cursoId: inscricao.cursoId,
            nome: inscricao.cursoNome,
            turmaNome: inscricao.turmaNome,
            status: parseStatusTurma(inscricao.status),
            dataConclusao: inscricao.dataConclusao,
            dataInicio: inscricao.dataInicio,
            dataFim: inscricao.dataFim,
        });
    }

    return lista;
}

function payloadFromMembro(membro: MembroDaCelulaListItemDto): MembroPayload {
    return {
        dadosPessoais: {
            nome: membro.nome ?? "",
            nascimento: membro.dataNascimento,
            email: membro.email ?? "",
            telefone: membro.telefone ?? "",
            endereco: membro.endereco ?? "",
            cargo: membro.funcao ?? PapelCelula.MEMBRO,
            ministerio: membro.ministerio ?? "Nenhum",
            discipulador: membro.discipulador ?? "",
            discipulo: membro.discipulando ?? "",
            estadoCivil: membro.estadoCivil ?? "Solteiro",
            conjuge: membro.conjuge ?? "",
            filhos: membro.filhos ?? "Nao",
        },
    };
}

export function RegisterMembro({
    open,
    onClose,
    onSuccess,
    celulaId,
    membro,
}: RegisterMembroProps) {
    const [tabValue, setTabValue] = useState("1");
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<MembroPayload>(initialPayload);
    const [cursosData, setCursosData] = useState<CursoCadastro[]>([]);
    const [trajetoriaData, setTrajetoriaData] = useState<any[]>([]);
    const [trajetoriaPronta, setTrajetoriaPronta] = useState(false);
    const [cursosProntos, setCursosProntos] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error" as "error" | "success",
    });

    const isEdicao = membro != null;

    useEffect(() => {
        if (!open) return;

        let ativo = true;
        setFormData(membro ? payloadFromMembro(membro) : initialPayload);
        setTrajetoriaPronta(false);
        setCursosProntos(false);

        async function carregarAbas() {
            try {
                if (membro) {
                    const [trajetoria, cursosMembro, cursosCatalogo] =
                        await Promise.all([
                            getTrajetoriaDoMembro(membro.id).catch(() => null),
                            getCursosDoMembro(membro.id).catch(() => []),
                            getCursosAtivosParaCadastro().catch(() => []),
                        ]);
                    if (!ativo) return;

                    if (trajetoria && trajetoria.grupos.length > 0) {
                        setTrajetoriaData(
                            calculateState(fasesFromTrajetoria(trajetoria)),
                        );
                    } else {
                        setTrajetoriaData(calculateState(initialFases));
                    }
                    setTrajetoriaPronta(trajetoria != null);

                    setCursosData(
                        mergeCursosCadastro(cursosCatalogo, cursosMembro),
                    );
                    setCursosProntos(true);
                    return;
                }

                const [trajetoriaAtiva, cursosCatalogo] = await Promise.all([
                    getTrajetoriaAtivaParaCadastro().catch(() => null),
                    getCursosAtivosParaCadastro().catch(() => []),
                ]);
                if (!ativo) return;

                if (trajetoriaAtiva && trajetoriaAtiva.grupos.length > 0) {
                    setTrajetoriaData(
                        calculateState(fasesFromTrajetoria(trajetoriaAtiva)),
                    );
                } else {
                    setTrajetoriaData(calculateState(initialFases));
                }
                setTrajetoriaPronta(true);

                setCursosData(
                    cursosCatalogo.map((turma) => ({
                        turmaId: turma.turmaId,
                        cursoId: turma.cursoId,
                        nome: turma.cursoNome,
                        turmaNome: turma.turmaNome,
                        status: StatusTurma.NAO_INICIADO,
                        dataConclusao: null,
                        dataInicio: turma.dataInicio,
                        dataFim: turma.dataFim,
                    })),
                );
                setCursosProntos(true);
            } catch (error) {
                console.error(error);
            }
        }

        void carregarAbas();

        return () => {
            ativo = false;
        };
    }, [open, membro]);

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: string,
    ) => setTabValue(newValue);
    const handleDadosChange = (field: string, value: any) =>
        setFormData((prev) => ({
            ...prev,
            dadosPessoais: { ...prev.dadosPessoais, [field]: value },
        }));

    const mostrarErro = (message: string) => {
        setSnackbar({
            open: true,
            message,
            severity: "error",
        });
        setTabValue("1");
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
        } = formData.dadosPessoais;

        if (!nome || nome.trim() === "") {
            mostrarErro("O campo Nome é obrigatório.");
            return false;
        }

        if (isEdicao) {
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                mostrarErro("E-mail inválido.");
                return false;
            }
            return true;
        }

        const requiredFields = [
            { key: nascimento, name: "Data de Nascimento" },
            { key: email, name: "Email" },
            { key: telefone, name: "Telefone" },
            { key: endereco, name: "Endereço" },
            { key: cargo, name: "Cargo" },
            { key: ministerio, name: "Ministério" },
        ];

        for (const field of requiredFields) {
            if (!field.key || String(field.key).trim() === "") {
                mostrarErro(`O campo ${field.name} é obrigatório.`);
                return false;
            }
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarErro("E-mail inválido.");
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

            const cursosSelecionados = isEdicao
                ? cursosData
                : cursosData.filter(
                    (curso) => curso.status !== StatusTurma.NAO_INICIADO,
                );

            const nascimento = formData.dadosPessoais.nascimento;
            const payloadCompleto = {
                dadosPessoais: {
                    ...formData.dadosPessoais,
                    nascimento:
                        nascimento && nascimento.includes("T")
                            ? nascimento.split("T")[0]
                            : nascimento,
                },
                cursos: cursosProntos ? cursosSelecionados : undefined,
                trajetoria: trajetoriaPronta ? passosMarcadosIds : undefined,
                vinculoId: membro?.vinculoId,
            };

            const result = isEdicao
                ? await updateMembroFromUI(membro.id, payloadCompleto, celulaId)
                : await createMembroFromUI(payloadCompleto, celulaId);

            if (!result.success) throw new Error(result.error);

            setSnackbar({
                open: true,
                message: isEdicao
                    ? "Membro atualizado com sucesso!"
                    : "Membro salvo com sucesso!",
                severity: "success",
            });

            const dados = payloadCompleto.dadosPessoais;
            setTimeout(() => {
                setFormData(initialPayload);
                setCursosData([]);
                setTrajetoriaData([]);
                setTrajetoriaPronta(false);
                setCursosProntos(false);
                setTabValue("1");
                onSuccess({
                    id: membro?.id,
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone,
                    dataNascimento: dados.nascimento,
                    endereco: dados.endereco,
                    estadoCivil: dados.estadoCivil,
                    conjuge: dados.conjuge,
                    filhos: dados.filhos,
                    discipulador: dados.discipulador,
                    discipulando: dados.discipulo,
                    ministerio: dados.ministerio,
                    funcao: dados.cargo,
                });
            }, 400);
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
            setTrajetoriaPronta(false);
            setCursosProntos(false);
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
                    {isEdicao ? "Editar membro" : "Novo membro"}
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
                    {cursosProntos && cursosData.length === 0 ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            px={4}
                        >
                            <Typography color="text.secondary">
                                Nenhum curso EMP disponível para este cadastro.
                            </Typography>
                        </Box>
                    ) : cursosData.length > 0 ? (
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
            {snackbar.open && snackbar.severity === "error" ? (
                <Alert
                    severity="error"
                    sx={{ mx: 4, mt: 1 }}
                    onClose={() =>
                        setSnackbar((prev) => ({ ...prev, open: false }))
                    }
                >
                    {snackbar.message}
                </Alert>
            ) : null}
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