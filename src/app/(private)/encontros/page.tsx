"use client";

import PageContainer from "@/ui/components/pages/PageContainer";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { Filtro } from "./components/lista-encontro/filtro";
import { useEncontrosSelecionados } from "./hooks/useEncontroSelecionado";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";
import { Informacao } from "./components/informacoes/informacao";
import { ModalCadastroEncontro, DadosEncontro } from "./components/modal-cadastro/ModalCadastroEncontro";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    deletarEncontro,
    salvarEncontroComFrequencias,
} from "@/app/actions/encontros";
import { enqueueSnackbar } from "notistack";
import { Encontro } from "@/modules/celulas/domain/encontro";
import type { FrequenciaSyncLinha } from "@/modules/celulas/domain/frequencia-sync";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { LIDER_AUXILIAR_ROLES } from "@/modules/controleacesso/domain/navigation";
import { estaNaSemanaAtual } from "@/ui/utils/datas";

export default function Encontros() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { loggedUser } = useAppAuthentication();
    const celulaId = loggedUser?.celulaId;
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        encontros,
        encontrosSelecionado,
        toggleEncontrosSelecionado,
        selectEncontro,
        deselectEncontro,
        loading,
        erro,
        refetch,
    } = useEncontrosSelecionados(celulaId);

    const [modalAberto, setModalAberto] = useState(false);
    const [encontroEditando, setEncontroEditando] = useState<Encontro | null>(null);
    const [dialogExcluirAberto, setDialogExcluirAberto] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [stepInicialModal, setStepInicialModal] = useState<0 | 1>(0);
    const lancarFrequenciaProcessadoRef = useRef(false);
    const verUltimoProcessadoRef = useRef(false);

    useEffect(() => {
        if (lancarFrequenciaProcessadoRef.current) return;
        if (searchParams.get("lancarFrequencia") !== "true") return;
        if (loading) return;

        lancarFrequenciaProcessadoRef.current = true;

        const encontroDaSemana = encontros
            .filter((e) => estaNaSemanaAtual(e.data))
            .sort((a, b) => b.data.localeCompare(a.data))[0];

        if (encontroDaSemana) {
            selectEncontro(encontroDaSemana);
            setEncontroEditando(encontroDaSemana);
            setStepInicialModal(1);
        } else {
            setEncontroEditando(null);
            setStepInicialModal(0);
        }
        setModalAberto(true);
        router.replace("/encontros", { scroll: false });
    }, [searchParams, loading, encontros, selectEncontro, router]);

    useEffect(() => {
        if (verUltimoProcessadoRef.current) return;
        if (searchParams.get("verUltimo") !== "true") return;
        if (loading) return;

        verUltimoProcessadoRef.current = true;

        const ultimoEncontro = [...encontros].sort((a, b) =>
            b.data.localeCompare(a.data)
        )[0];

        if (ultimoEncontro) {
            selectEncontro(ultimoEncontro);
        }
        router.replace("/encontros", { scroll: false });
    }, [searchParams, loading, encontros, selectEncontro, router]);

    const handleSalvarEncontro = async (payload: {
        dados: DadosEncontro;
        frequencias: FrequenciaSyncLinha[];
    }) => {
        if (celulaId == null) {
            throw new Error("Nenhuma célula vinculada foi encontrada para o usuário logado.");
        }

        const { dados, frequencias } = payload;

        try {
            await salvarEncontroComFrequencias({
                celulaId,
                editandoId: encontroEditando?.id ?? null,
                dados,
                frequencias,
            });

            enqueueSnackbar(
                encontroEditando?.id
                    ? "Encontro e frequência atualizados com sucesso!"
                    : "Encontro e frequência registrados com sucesso!",
                { variant: "success", autoHideDuration: 2000 }
            );

            setModalAberto(false);
            setEncontroEditando(null);
            await refetch();
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Erro ao salvar encontro.";
            throw new Error(message);
        }
    };

    const handleEditarEncontro = () => {
        if (!encontrosSelecionado) return;
        
        setEncontroEditando(encontrosSelecionado);
        setModalAberto(true);
    };

    const handleFecharModal = () => {
        setModalAberto(false);
        setEncontroEditando(null);
        setStepInicialModal(0);
    };

    const handleAbrirExcluir = () => {
        if (!encontrosSelecionado?.id) return;
        setDialogExcluirAberto(true);
    };

    const handleFecharDialogExcluir = () => {
        if (excluindo) return;
        setDialogExcluirAberto(false);
    };

    const handleConfirmarExcluir = async () => {
        if (celulaId == null || !encontrosSelecionado?.id) return;
        setExcluindo(true);
        try {
            await deletarEncontro(encontrosSelecionado.id, celulaId);
            enqueueSnackbar("Encontro excluído com sucesso.", {
                variant: "success",
                autoHideDuration: 2000,
            });
            setDialogExcluirAberto(false);
            deselectEncontro();
            await refetch();
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao excluir o encontro.";
            enqueueSnackbar(message, { variant: "error", autoHideDuration: 4000 });
        } finally {
            setExcluindo(false);
        }
    };

    return (
        <PageContainer
            title="Encontros"
            description="Página Encontros"
            allowedRoles={LIDER_AUXILIAR_ROLES}
        >
            {loading ? (
                <LoadingBox />
            ) : erro ? (
                <ErrorBox message={erro} />
            ) : (
                <>
                    <Box sx={{
                        display: "flex",
                        pt: 2,
                        gap: { xs: 3, md: 5 },
                        flexDirection: { xs: "column", md: "row" },
                    }}>
                        {(!isMobile || !encontrosSelecionado) && (
                            <Box sx={{ width: { xs: "100%", md: 348 }, flexShrink: 0 }}>
                                <Filtro
                                    data={encontros}
                                    onSelect={toggleEncontrosSelecionado}
                                    encontroSelecionado={encontrosSelecionado}
                                    onRegistrar={() => setModalAberto(true)}
                                />
                            </Box>
                        )}

                        {(!isMobile || !!encontrosSelecionado) && (
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Informacao
                                    data={encontrosSelecionado || null}
                                    onBack={isMobile ? deselectEncontro : undefined}
                                    onEditar={handleEditarEncontro}
                                    onExcluir={handleAbrirExcluir}
                                />
                            </Box>
                        )}
                    </Box>

                    <ModalCadastroEncontro
                        open={modalAberto}
                        onClose={handleFecharModal}
                        onSave={handleSalvarEncontro}
                        celulaId={celulaId ?? null}
                        frequenciasExistentes={encontroEditando?.frequencia}
                        stepInicial={stepInicialModal}
                        dadosIniciais={encontroEditando ? {
                            celula_id: encontroEditando.celula_id,
                            tema: encontroEditando.tema,
                            data: encontroEditando.data,
                            horario: encontroEditando.horario.substring(0, 5), // Remove os segundos
                            local: encontroEditando.local,
                            anfitriao: encontroEditando.anfitriao,
                            preletor: encontroEditando.preletor,
                            supervisao: encontroEditando.supervisao ? "sim" : "não",
                            conversoes: encontroEditando.conversoes ? "sim" : "não",
                            observacoes: encontroEditando.observacoes,
                        } : null}
                        encontroId={encontroEditando?.id || null}
                    />

                    <Dialog
                        open={dialogExcluirAberto}
                        onClose={handleFecharDialogExcluir}
                        aria-labelledby="dialog-excluir-encontro-titulo"
                    >
                        <DialogTitle id="dialog-excluir-encontro-titulo">
                            Excluir encontro
                        </DialogTitle>
                        <DialogContent>
                            Esta ação não pode ser desfeita. O encontro e as
                            frequências vinculadas serão removidos permanentemente.
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button
                                onClick={handleFecharDialogExcluir}
                                disabled={excluindo}
                                color="inherit"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => void handleConfirmarExcluir()}
                                disabled={excluindo}
                                color="error"
                                variant="contained"
                            >
                                {excluindo ? "Excluindo…" : "Excluir"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </PageContainer>
    );
}
