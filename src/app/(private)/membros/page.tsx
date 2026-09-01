"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from "@/ui/components/pages/PageContainer";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Filtro } from "./components/lista-membros/filtro";
import { useMembrosSelecionados } from "./hooks/useMembroSelecionado";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";
import { Informacao } from "./components/informacoes/informacao";
import { LIDER_AUXILIAR_ROLES } from "@/modules/controleacesso/domain/navigation";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { RegisterMembro } from "./components/registro-membros/registerMembro";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";

function MembrosContent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const searchParams = useSearchParams();
    const router = useRouter();
    const { loggedUser } = useAppAuthentication();
    const celulaId = loggedUser?.celulaId;
    const membroIdParam = searchParams.get("membroId");
    const membroIdInicial = membroIdParam ? Number(membroIdParam) : null;
    const [isOpenRegister, setIsOpenRegister] = useState(false);
    const [membroEditando, setMembroEditando] =
        useState<MembroDaCelulaListItemDto | null>(null);
    const [cursosRefreshKey, setCursosRefreshKey] = useState(0);

    const {
        membros,
        membroSelecionado,
        toggleMembroSelecionado,
        deselectMembro,
        refetch,
        aplicarEdicao,
        loading,
        erro,
    } = useMembrosSelecionados(
        celulaId,
        Number.isFinite(membroIdInicial) ? membroIdInicial : null,
    );

    const mostrarLista = !isMobile || !membroSelecionado;
    const mostrarInfo = !isMobile || !!membroSelecionado;

    const handleClickRegister = () => {
        setIsOpenRegister(true);
    };

    const handleCloseRegister = () => {
        setIsOpenRegister(false);
        setMembroEditando(null);
    };

    const handleRegisterSuccess = async (
        membroAtualizado?: Partial<MembroDaCelulaListItemDto>,
    ) => {
        setIsOpenRegister(false);
        setMembroEditando(null);
        if (membroAtualizado) aplicarEdicao(membroAtualizado);
        setCursosRefreshKey((atual) => atual + 1);
        await refetch();
        router.refresh();
    };

    return (
        <PageContainer
            title="Membros"
            description="Página Membros"
            allowedRoles={LIDER_AUXILIAR_ROLES}
        >
            {loading ? (
                <LoadingBox />
            ) : erro ? (
                <ErrorBox message={erro} />
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        pt: 2,
                        gap: { xs: 3, md: 5 },
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    {mostrarLista && (
                        <Box
                            sx={{
                                width: { xs: "100%", md: 348 },
                                flexShrink: 0,
                            }}
                        >
                            <Filtro
                                data={membros}
                                onSelect={toggleMembroSelecionado}
                                membroSelecionado={membroSelecionado}
                                onRegistrar={handleClickRegister}
                            />
                        </Box>
                    )}

                    {mostrarInfo && (
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Informacao
                                data={membroSelecionado || null}
                                onBack={isMobile ? deselectMembro : undefined}
                                onDesvincular={refetch}
                                refreshKey={cursosRefreshKey}
                                onEditar={() => {
                                    if (membroSelecionado) {
                                        setMembroEditando(membroSelecionado);
                                    }
                                }}
                            />
                        </Box>
                    )}
                    {(isOpenRegister || membroEditando) && (
                        <RegisterMembro
                            open={isOpenRegister || membroEditando != null}
                            membro={membroEditando}
                            onClose={handleCloseRegister}
                            onSuccess={handleRegisterSuccess}
                            celulaId={celulaId}
                        />
                    )}
                </Box>
            )}
        </PageContainer>
    );
}

export default function Membros() {
    return (
        <Suspense fallback={<LoadingBox />}>
            <MembrosContent />
        </Suspense>
    );
}
