"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "./DashboardHeader";
import { SaudeCelulaCard } from "./SaudeCelulaCard";
import { SaudeCelulaDetalhesModal } from "./SaudeCelulaDetalhesModal";
import { MetasCelulaCard } from "./MetasCelulaCard";
import { MembrosAtencaoCard } from "./MembrosAtencaoCard";
import { PulsoSemanaCard } from "./PulsoSemanaCard";
import { useDashboardCelula } from "../hooks/useDashboardCelula";
import { usePulsoSemana } from "../hooks/usePulsoSemana";
import { useMembrosEmAtencao } from "../hooks/useMembrosEmAtencao";
import { useMetasCelula } from "../hooks/useMetasCelula";
import { useSaudeCelula } from "../hooks/useSaudeCelula";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";

const emBreve = () =>
    enqueueSnackbar("Funcionalidade disponível em breve!", {
        variant: "info",
        autoHideDuration: 2000,
    });

export function DashboardScreen() {
    const router = useRouter();
    const { celulaId, ready, semCelula } = useDashboardCelula();

    const { pulso, loading: loadingPulso, erro: erroPulso } = usePulsoSemana(celulaId);
    const { membros, loading: loadingAtencao, erro: erroAtencao } = useMembrosEmAtencao(celulaId);
    const { metas, loading: loadingMetas, erro: erroMetas } = useMetasCelula(celulaId);
    const { saude, loading: loadingSaude, erro: erroSaude } = useSaudeCelula(celulaId);

    const [detalhesSaudeAberto, setDetalhesSaudeAberto] = useState(false);

    const detalhesSaudeCarregando =
        loadingPulso || loadingMetas || loadingAtencao || !pulso;

    if (!ready) return <LoadingBox />;

    if (semCelula) {
        return (
            <ErrorBox message="Nenhuma célula vinculada foi encontrada para o usuário logado." />
        );
    }

    const handleLancarFrequencia = () => {
        router.push("/encontros?lancarFrequencia=true");
    };

    const handleVerDetalhesPulso = () => {
        router.push("/encontros?verUltimo=true");
    };

    // TODO: levar para modal de cadastro quando implementado
    const handleCadastrarMembro = () => emBreve();

    const handleVerFicha = (id: string) => {
        router.push(`/membros?membroId=${id}`);
    };

    const handleEnviarMensagem = (id: string) => {
        const membro = membros.find((m) => m.id === id);
        if (membro?.telefone) {
            const telefoneE164 = membro.telefone.replace(/\D/g, "");
            window.open(`https://wa.me/55${telefoneE164}`, "_blank");
        } else {
            enqueueSnackbar("Telefone não cadastrado para este membro.", {
                variant: "warning",
                autoHideDuration: 2000,
            });
        }
    };

    // TODO: Requer Server Action tocando acompanhamento_pastoral_membros — decisão de produto pendente
    const handleRegistrarPastoreio = () => emBreve();
    // TODO: Requer Server Action tocando acompanhamento_pastoral_membros — decisão de produto pendente
    const handleMarcarAcompanhado = () => emBreve();
    // TODO: Requer tabela dashboard_dispensas + persistência (membroId, dataLimite) — decisão de produto pendente
    const handleAdiar = () => emBreve();

    return (
        <Box>
            <DashboardHeader
                onLancarFrequencia={handleLancarFrequencia}
                onRegistrarMembro={handleCadastrarMembro}
            />

            <Box
                sx={{
                    display: "grid",
                    gap: { xs: 2, md: 3 },
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(0, 360px) minmax(0, 1fr) minmax(0, 1fr)",
                    },
                    gridTemplateRows: { md: "auto auto" },
                    gridTemplateAreas: {
                        xs: `
                            "coluna1"
                            "atencao"
                            "pulso"
                        `,
                        md: `
                            "coluna1 atencao atencao"
                            "coluna1 pulso pulso"
                        `,
                    },
                }}
            >
                <Box
                    sx={{
                        gridArea: "coluna1",
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 2, md: 3 },
                        minWidth: 0,
                    }}
                >
                    {loadingSaude ? (
                        <LoadingBox />
                    ) : erroSaude ? (
                        <ErrorBox message={erroSaude} />
                    ) : saude ? (
                        <SaudeCelulaCard
                            titulo="Saúde da célula"
                            mensagem={saude.mensagem}
                            versiculo={saude.versiculo}
                            classe={saude.classe}
                            detalhesLoading={detalhesSaudeCarregando}
                            onVerDetalhes={() => setDetalhesSaudeAberto(true)}
                        />
                    ) : null}

                    <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
                        {loadingMetas ? (
                            <LoadingBox />
                        ) : erroMetas ? (
                            <ErrorBox message={erroMetas} />
                        ) : (
                            <Box sx={{ width: "100%", mt: 2 }}>
                                <MetasCelulaCard metas={metas} />
                            </Box>
                        )}
                    </Box>
                </Box>

                <Box sx={{ gridArea: "atencao" }}>
                    {loadingAtencao ? (
                        <LoadingBox />
                    ) : erroAtencao ? (
                        <ErrorBox message={erroAtencao} />
                    ) : (
                        <MembrosAtencaoCard
                            membros={membros}
                            onVerFicha={handleVerFicha}
                            onEnviarMensagem={handleEnviarMensagem}
                            onRegistrarPastoreio={handleRegistrarPastoreio}
                            onMarcarAcompanhado={handleMarcarAcompanhado}
                            onAdiar={handleAdiar}
                        />
                    )}
                </Box>

                <Box sx={{ gridArea: "pulso" }}>
                    {loadingPulso ? (
                        <LoadingBox />
                    ) : erroPulso ? (
                        <ErrorBox message={erroPulso} />
                    ) : pulso ? (
                        <PulsoSemanaCard
                            pulso={pulso}
                            onVerDetalhes={handleVerDetalhesPulso}
                        />
                    ) : null}
                </Box>
            </Box>

            {saude && pulso && (
                <SaudeCelulaDetalhesModal
                    open={detalhesSaudeAberto}
                    onClose={() => setDetalhesSaudeAberto(false)}
                    saude={saude}
                    pulso={pulso}
                    membrosAtencao={membros}
                    metas={metas}
                />
            )}
        </Box>
    );
}
