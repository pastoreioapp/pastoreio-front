import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { EtapaCard } from "./etapaCard";
import { CursoCard } from "./cursoCard";
import { FrequenciaCalendario } from "./frequenciaCalendario";
import { useTrajetoriaMembro } from "../../hooks/useTrajetoriaMembro";
import { useCursosDoMembro } from "../../hooks/useCursosDoMembro";
import { useFrequenciasMembro } from "../../hooks/useFrequenciasMembro";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";
import { registrarAvancoPasso } from "@/app/actions/trajetoria";
import { registrarAvancoInscricao } from "@/app/actions/cursos";

const STYLE_TAB = {
    fontSize: { xs: "14px", md: "16px" },
    fontWeight: "500",
    width: { xs: "auto", md: "180px" },
    minWidth: "unset",
    padding: { xs: 1.5, md: 2.5 },
    color: "text.secondary",
    "&.Mui-selected": {
        color: "#000",
    },
};

export function EtapasTabs({
    membroId,
    podeRegistrarAvancos = false,
}: {
    membroId: number;
    podeRegistrarAvancos?: boolean;
}) {
    const [tab, setTab] = useState("1");
    const [passoEmRegistro, setPassoEmRegistro] = useState<number | null>(null);
    const [inscricaoEmRegistro, setInscricaoEmRegistro] = useState<number | null>(null);

    const { trajetoria, loading, erro, refetch: refetchTrajetoria } = useTrajetoriaMembro(membroId);
    const {
        cursos,
        loading: cursosLoading,
        erro: cursosErro,
        refetch: refetchCursos,
    } = useCursosDoMembro(membroId);
    const { frequencias, loading: freqLoading, erro: freqErro } = useFrequenciasMembro(membroId);

    async function handleMarcarPasso(passoId: number) {
        try {
            setPassoEmRegistro(passoId);
            await registrarAvancoPasso(membroId, passoId);
            enqueueSnackbar("Passo registrado com sucesso!", {
                variant: "success",
                autoHideDuration: 2000,
            });
            refetchTrajetoria();
        } catch (error: unknown) {
            enqueueSnackbar(
                error instanceof Error ? error.message : "Erro ao registrar passo",
                { variant: "error", autoHideDuration: 3000 },
            );
        } finally {
            setPassoEmRegistro(null);
        }
    }

    async function handleMarcarInscricao(inscricaoId: number) {
        try {
            setInscricaoEmRegistro(inscricaoId);
            await registrarAvancoInscricao(inscricaoId);
            enqueueSnackbar("Curso marcado como concluído!", {
                variant: "success",
                autoHideDuration: 2000,
            });
            refetchCursos();
        } catch (error: unknown) {
            enqueueSnackbar(
                error instanceof Error ? error.message : "Erro ao registrar conclusão",
                { variant: "error", autoHideDuration: 3000 },
            );
        } finally {
            setInscricaoEmRegistro(null);
        }
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            paddingTop="10px"
            marginX="auto"
            sx={{
                overflowX: "auto",
            }}
        >
            <TabContext value={tab}>
                <Box
                    display="flex"
                    justifyContent="center"
                    borderBottom={1}
                    borderColor="divider"
                >
                    <TabList
                        onChange={(e, v) => setTab(v)}
                        TabIndicatorProps={{
                            sx: {
                                backgroundColor: "#5E79B3",
                                borderRadius: "1.5px",
                            },
                        }}
                    >
                        <Tab label="Trajetória" value="1" sx={STYLE_TAB} />
                        <Tab label="Cursos EMP" value="2" sx={STYLE_TAB} />
                        <Tab label="Frequência" value="3" sx={STYLE_TAB} />
                    </TabList>
                </Box>
                <TabPanel
                    value="1"
                    sx={{
                        paddingTop: 3,
                    }}
                >
                    {loading && <LoadingBox />}
                    {erro && <ErrorBox message={erro} />}
                    {!loading && !erro && trajetoria && (
                        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                            {trajetoria.grupos.map((grupo) => (
                                <EtapaCard
                                    key={grupo.id}
                                    etapa={grupo.ordem}
                                    titulo={grupo.nome}
                                    exibirEtapa={trajetoria.grupos.length > 1}
                                    podeRegistrarAvancos={podeRegistrarAvancos}
                                    passoEmRegistro={passoEmRegistro}
                                    onMarcarConcluido={
                                        podeRegistrarAvancos ? handleMarcarPasso : undefined
                                    }
                                    itens={grupo.passos.map((p) => ({
                                        id: p.id,
                                        label: p.nome,
                                        concluido: p.concluido,
                                    }))}
                                />
                            ))}
                        </Box>
                    )}
                    {!loading && !erro && !trajetoria && (
                        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                                <IconInfoCircleFilled size={24} />
                                Nenhuma trajetória ativa encontrada.
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value="2" sx={{ paddingTop: 3 }}>
                    {cursosLoading && <LoadingBox />}
                    {cursosErro && <ErrorBox message={cursosErro} />}
                    {!cursosLoading && !cursosErro && cursos.length > 0 && (
                        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                            {cursos.map((curso) => (
                                <CursoCard
                                    key={curso.inscricaoId}
                                    inscricaoId={curso.inscricaoId}
                                    cursoNome={curso.cursoNome}
                                    turmaNome={curso.turmaNome}
                                    status={curso.status}
                                    statusLabel={curso.statusLabel}
                                    dataInicio={curso.dataInicio}
                                    dataFim={curso.dataFim}
                                    concluidoEm={curso.concluidoEm}
                                    podeRegistrarAvancos={podeRegistrarAvancos}
                                    registrando={inscricaoEmRegistro === curso.inscricaoId}
                                    onMarcarConcluido={
                                        podeRegistrarAvancos ? handleMarcarInscricao : undefined
                                    }
                                />
                            ))}
                        </Box>
                    )}
                    {!cursosLoading && !cursosErro && cursos.length === 0 && (
                        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                                <IconInfoCircleFilled size={24} />
                                Nenhum curso encontrado.
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value="3" sx={{ paddingTop: 3, px: { xs: 0, md: 3 } }}>
                    {freqLoading && <LoadingBox />}
                    {freqErro && <ErrorBox message={freqErro} />}
                    {!freqLoading && !freqErro && frequencias.length > 0 && (
                        <FrequenciaCalendario frequencias={frequencias} />
                    )}
                    {!freqLoading && !freqErro && frequencias.length === 0 && (
                        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                                <IconInfoCircleFilled size={24} />
                                Nenhuma frequência registrada.
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
            </TabContext>
        </Box>
    );
}
