"use client";

import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Box, Button } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { Filtro } from "./components/lista-encontro/filtro";
import { useEncontrosSelecionados } from "./hooks/useEncontroSelecionado";
import { LoadingBox } from "./components/loading/LoadingBox";
import { ErrorBox } from "./components/error/ErrorBox";
import { Informacao } from "./components/informacoes/informacao";
import { ModalCadastroEncontro, DadosEncontro } from "./components/modal-cadastro/ModalCadastroEncontro";
import { criarEncontro } from "@/features/encontros/encontros.service";
import { EncontroInsert } from "@/features/encontros/types";
import { useState } from "react";

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
        // Converter "sim"/"não" para boolean e adicionar campos obrigatórios
        const dadosFormatados: any = {
            tema: dados.tema,
            data: dados.data,
            horario: "19:00:00", // Valor padrão - TODO: adicionar campo no modal
            local: "A definir", // Valor padrão - TODO: adicionar campo no modal
            anfitriao: dados.anfitriao,
            preletor: dados.preletor,
            supervisao: dados.supervisao === "sim",
            conversoes: dados.conversoes === "sim",
            criado_em: new Date().toISOString(),
            criado_por: "sistema", // TODO: pegar usuário logado
            deletado: false,
        };
        
        await criarEncontro(dadosFormatados);
        
        alert("Encontro cadastrado com sucesso!");
        setModalAberto(false);
        
        // Recarregar a lista de encontros
        await refetch();
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
