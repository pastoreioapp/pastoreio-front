"use client";

import DashboardCard from "@/ui/components/ui/DashboardCard";
import PageContainer from "@/ui/components/pages/PageContainer";
import { Box, Button } from "@mui/material";
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
import type { EncontroInsert } from "@/modules/celulas/domain/encontro";
import { enqueueSnackbar } from "notistack";

export default function Encontros() {
    const {
        encontros,
        encontrosSelecionado,
        toggleEncontrosSelecionado,
        loading,
        erro,
        refetch,
    } = useEncontrosSelecionados();

    const [modalAberto, setModalAberto] = useState(false);

    const handleSalvarEncontro = async (dados: DadosEncontro) => {
        try {
            const observacoesNormalizadas = [
                `Anfitrião: ${dados.anfitriao}`,
                `Preletor: ${dados.preletor}`,
                `Houve supervisão do setor: ${dados.supervisao}`,
                `Houve conversões: ${dados.conversoes}`,
                dados.observacoes?.trim() ? `Observações: ${dados.observacoes.trim()}` : "",
            ]
                .filter(Boolean)
                .join("\n");

            const dadosParaSalvar: EncontroInsert = {
                celula_id: dados.celula_id || null,
                data: dados.data,
                tema: dados.tema,
                observacoes: observacoesNormalizadas,
                horario: "19:00:00",
                local: "A definir",
                criado_em: new Date().toISOString(),
                criado_por: "sistema",
                deletado: false,
            };

            const repo = new EncontroRepository();
            const service = new EncontroService(repo);
            await service.create(dadosParaSalvar);

            setModalAberto(false);
            enqueueSnackbar("Encontro registrado com sucesso!", { variant: "success" });
            await refetch();
        } catch (error: any) {
            console.error("Erro ao salvar encontro:", error);
            throw new Error(error?.message || "Erro ao salvar encontro.");
        }
    };

    if (loading) return <LoadingBox />;
    if (erro) return <ErrorBox message={erro} />;

    return (
        <PageContainer title="Encontros" description="Página Encontros">
            <DashboardCard>
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

                    <Box sx={{ display: "flex", pt: "24px" }}>
                        <Box width={348}>
                            <Filtro
                                data={encontros}
                                onSelect={toggleEncontrosSelecionado}
                                encontroSelecionado={encontrosSelecionado}
                            />
                        </Box>

                        <Box flex={1} sx={{ pl: "33px", pr: "17px" }}>
                            <Informacao data={encontrosSelecionado || null} />
                        </Box>
                    </Box>
                </Box>
            </DashboardCard>

            <ModalCadastroEncontro
                open={modalAberto}
                onClose={() => setModalAberto(false)}
                onSave={handleSalvarEncontro}
            />
        </PageContainer>
    );
}
