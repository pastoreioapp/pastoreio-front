"use client";

import PageContainer from "@/ui/components/pages/PageContainer";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { Filtro } from "./components/lista-membros/filtro";
import { useMembrosSelecionados } from "./hooks/useMembroSelecionado";
import { LoadingBox } from "./components/loading/LoadingBox";
import { ErrorBox } from "./components/error/ErrorBox";
import { Informacao } from "./components/informacoes/informacao";
import { CELULA_ROLES } from "@/modules/controleacesso/domain/types";
import { enqueueSnackbar } from "notistack";

export default function Membros() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    // TODO: obter celulaId do usuário logado (ex.: contexto, rota /celulas/[id]/membros ou sessão)
    const celulaId = 3;
    const {
        membros,
        membroSelecionado,
        toggleMembroSelecionado,
        deselectMembro,
        loading,
        erro,
    } = useMembrosSelecionados(celulaId);

    if (loading) return <LoadingBox />;
    if (erro) return <ErrorBox message={erro} />;

    const mostrarLista = !isMobile || !membroSelecionado;
    const mostrarInfo = !isMobile || !!membroSelecionado;

    return (
        <PageContainer title="Membros" description="Página Membros" allowedRoles={CELULA_ROLES}>
            <Box>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Button
                        variant="contained"
                        onClick={() => enqueueSnackbar("Funcionalidade disponível em breve!", { variant: "info", autoHideDuration: 2000 })}
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

                <Box sx={{
                    display: "flex",
                    pt: 5,
                    gap: { xs: 3, md: 5 },
                    flexDirection: { xs: "column", md: "row" },
                }}>
                    {mostrarLista && (
                        <Box sx={{ width: { xs: "100%", md: 348 }, flexShrink: 0 }}>
                            <Filtro
                                data={membros}
                                onSelect={toggleMembroSelecionado}
                                membroSelecionado={membroSelecionado}
                            />
                        </Box>
                    )}

                    {mostrarInfo && (
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Informacao
                                data={membroSelecionado || null}
                                onBack={isMobile ? deselectMembro : undefined}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </PageContainer>
    );
}
