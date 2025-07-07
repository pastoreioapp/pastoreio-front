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
                            }}
                        >
                            <IconPlus width={16} /> Registrar membro
                        </Button>
                    </Box>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={4} sm={4} md={3}>
                            <Filtro
                                data={membros}
                                onSelect={setMembroSelecionado}
                            />
                        </Grid>

                        <Grid item xs={8} sm={8} md={9}>
                            <Informacao data={membroSelecionado!} />
                        </Grid>
                    </Grid>
                </Box>
            </DashboardCard>
        </PageContainer>
    );
}
