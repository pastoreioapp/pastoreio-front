"use client";

import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Alert, Box, Button, CircularProgress, Grid } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { Filtro } from "./components/filtro";
import { Informacao } from "./components/informacao";
import { useEffect, useState } from "react";
import { getMembros } from "@/features/membros/membros.service";
import { Membro } from "@/features/membros/types";

export default function Membros() {
    const [membros, setMembros] = useState<Membro[]>([]);
    const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    function selecionarMembroInicial(membros: Membro[]) {
        return (
            membros.find((m) => m.funcao.toLowerCase().includes("líder")) ||
            membros[0]
        );
    }

    function toggleMembroSelecionado(membro: Membro) {
        setMembroSelecionado((prev) =>
            prev?.id === membro.id ? null : membro
        );
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMembros();
                setMembros(data);
                setMembroSelecionado(selecionarMembroInicial(data));
            } catch (error: any) {
                setErro(error.message || "Erro ao carregar membros");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (erro) {
        return (
            <Box mt={4}>
                <Alert severity="error">{erro}</Alert>
            </Box>
        );
    }

    return (
        <PageContainer title="Membros" description="Página Membros" allowedRoles={['LIDER_CELULA']}>
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
