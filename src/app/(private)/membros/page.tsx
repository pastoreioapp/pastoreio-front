"use client";

import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Box, Button } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { Filtro } from "./components/lista-membros/filtro";
import { useMembrosSelecionados } from "./hooks/useMembroSelecionado";
import { LoadingBox } from "./components/loading/LoadingBox";
import { ErrorBox } from "./components/error/ErrorBox";
import { Informacao } from "./components/informacoes/informacao";
import { CELULA_ROLES } from "@/features/auth/types";

export default function Membros() {
    const {
        membros,
        membroSelecionado,
        toggleMembroSelecionado,
        loading,
        erro,
    } = useMembrosSelecionados();

    if (loading) return <LoadingBox />;
    if (erro) return <ErrorBox message={erro} />;

    return (
        <PageContainer title="Membros" description="Página Membros" allowedRoles={CELULA_ROLES}>
            <DashboardCard>
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#5E79B3",
                                fontSize: 13,
                                fontWeight: 600,
                                display: "flex",
                                gap: 1,
                                color: "#fff",
                            }}
                        >
                            <IconPlus width={16} /> Registrar membro
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", pt: "24px" }}>
                        <Box width={348}>
                            <Filtro
                                data={membros}
                                onSelect={toggleMembroSelecionado}
                                membroSelecionado={membroSelecionado}
                            />
                        </Box>

                        <Box flex={1} sx={{ pl: "33px", pr: "17px" }}>
                            <Informacao data={membroSelecionado || null} />
                        </Box>
                    </Box>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
}
