"use client";

import DashboardCard from "@/ui/components/ui/DashboardCard";
import PageContainer from "@/ui/components/pages/PageContainer";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { Filtro } from "./components/lista-encontro/filtro";
import { useEncontrosSelecionados } from "./hooks/useEncontroSelecionado";
import { LoadingBox } from "./components/loading/LoadingBox";
import { ErrorBox } from "./components/error/ErrorBox";
import { Informacao } from "./components/informacoes/informacao";
import { ModalCadastroEncontro, DadosEncontro } from "./components/modal-cadastro/ModalCadastroEncontro";
import { useState } from "react";
import { EncontroService } from "@/modules/celulas/application/encontro.service";
import { EncontroRepository } from "@/modules/celulas/infra/encontro.repository";
import { enqueueSnackbar } from "notistack";
import { Encontro } from "@/modules/celulas/domain/encontro";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";

export default function Encontros() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const {
        encontros,
        encontrosSelecionado,
        toggleEncontrosSelecionado,
        deselectEncontro,
        loading,
        erro,
        refetch,
    } = useEncontrosSelecionados();
    const {loggedUser} = useAppAuthentication();

    const [modalAberto, setModalAberto] = useState(false);

    const handleSalvarEncontro = async (dados: DadosEncontro) => {
        try {
            const dadosParaSalvar: Encontro = {
                celula_id: dados.celula_id || null,
                data: dados.data,
                tema: dados.tema,
                horario: `${dados.horario}:00`,
                local: dados.local,
                anfitriao: dados.anfitriao,
                preletor: dados.preletor,
                supervisao: dados.supervisao === "sim",
                conversoes: dados.conversoes === "sim",
                observacoes: dados.observacoes,
                criado_em: new Date().toISOString(),
                criado_por: loggedUser?.email || "UNKNOWN"
            };

            const repo = new EncontroRepository();
            const service = new EncontroService(repo);
            await service.create(dadosParaSalvar);

            setModalAberto(false);
            enqueueSnackbar("Encontro registrado com sucesso!", { variant: "success" });
            await refetch();
        } catch (error: any) {
            throw new Error(error?.message || "Erro ao salvar encontro.");
        }
    };

    if (loading) return <LoadingBox />;
    if (erro) return <ErrorBox message={erro} />;

    return (
        <PageContainer title="Encontros" description="Página Encontros">
            <Box>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Button
                        variant="contained"
                        onClick={() => setModalAberto(true)}
                        sx={{
                            bgcolor: "#5E79B3",
                            fontSize: 13,
                            fontWeight: 600,
                            display: "flex",
                            gap: 1,
                            color: "#fff",
                        }}
                    >
                        <IconPlus width={16} /> Registrar encontro
                    </Button>
                </Box>

                <Box sx={{
                    display: "flex",
                    pt: 5,
                    gap: { xs: 3, md: 5 },
                    flexDirection: { xs: "column", md: "row" },
                }}>
                    {(!isMobile || !encontrosSelecionado) && (
                        <Box sx={{ width: { xs: "100%", md: 348 } }}>
                            <Filtro
                                data={encontros}
                                onSelect={toggleEncontrosSelecionado}
                                encontroSelecionado={encontrosSelecionado}
                            />
                        </Box>
                    )}

                    {(!isMobile || !!encontrosSelecionado) && (
                        <Box flex={1} sx={{ pl: { xs: 0, md: "33px" }, pr: { xs: 0, md: "17px" } }}>
                            <Informacao
                                data={encontrosSelecionado || null}
                                onBack={isMobile ? deselectEncontro : undefined}
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            <ModalCadastroEncontro
                open={modalAberto}
                onClose={() => setModalAberto(false)}
                onSave={handleSalvarEncontro}
            />
        </PageContainer>
    );
}
