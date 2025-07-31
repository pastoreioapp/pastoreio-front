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

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMembros();
                setMembros(data);

                const lider = data.find((m) =>
                    m.funcao.toLowerCase().includes("líder")
                );
                setMembroSelecionado(lider || data[0]);
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
        <PageContainer title="Membros" description="Página Membros">
            <DashboardCard>
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#5E79B3",
                                fontSize: "13px",
                                fontWeight: "600",
                                display: "flex",
                                gap: 1,
                                color: "#fff",
                            }}
                        >
                            <IconPlus width={16} /> Registrar membro
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            paddingTop: "24px",
                        }}
                    >
                        <Box sx={{ width: "348px" }}>
                            <Filtro
                                data={membros}
                                onSelect={setMembroSelecionado}
                            />
                        </Box>

                        <Box
                            sx={{
                                paddingLeft: "33px",
                                paddingRight: "17px",
                                width: "100%",
                            }}
                        >
                            <Informacao data={membroSelecionado!} />
                        </Box>
                    </Box>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
}
