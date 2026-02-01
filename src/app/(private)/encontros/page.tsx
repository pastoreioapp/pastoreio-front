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

export default function Encontros() {
    const {
        encontros,
        encontrosSelecionado,
        toggleEncontrosSelecionado,
        loading,
        erro,
    } = useEncontrosSelecionados();

    const [modalAberto, setModalAberto] = useState(false);

    const handleSalvarEncontro = (dados: DadosEncontro) => {
        console.log("Dados do encontro:", dados);
        // TODO: Integrar com a API quando estiver pronta
        // Exemplo: await salvarEncontro(dados);
        alert("Encontro cadastrado com sucesso! (Por enquanto apenas no console)");
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
