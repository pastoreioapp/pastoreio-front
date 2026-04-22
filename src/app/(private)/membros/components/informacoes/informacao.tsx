"use client";

import { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { IconArrowLeft, IconPencil, IconUserMinus, IconUserSearch } from "@tabler/icons-react";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import { InformacaoHeader } from "./informacoesHeader";
import { InformacoesGroup } from "./informacoesGroup";
import { EtapasTabs } from "./etapasTabs";
import { ModalConfirmarDesvinculo } from "./ModalConfirmarDesvinculo";
import { desvincularMembroDaCelula } from "@/app/actions/celulas";
import { enqueueSnackbar } from "notistack";

const MensagemNenhumMembroSelecionado = () => (
    <Box
        sx={{
            border: "2px dashed #DEE3EA",
            width: "100%",
            height: "100%",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
        }}
    >
        <IconUserSearch size={48} stroke={1.5} color="#5A6A85" />
        <Typography sx={{ color: "text.secondary", fontSize: "16px" }}>
            Selecione um membro para visualizar suas informações
        </Typography>
    </Box>
);

const FUNCOES_DESVINCULAVEIS = [
    PapelCelula.MEMBRO,
    PapelCelula.VISITANTE,
] as const;

export function Informacao({
    data,
    onBack,
    onDesvincular,
}: {
    data: MembroDaCelulaListItemDto | null;
    onBack?: () => void;
    onDesvincular?: () => void;
}) {
    const [modalAberto, setModalAberto] = useState(false);
    const [desvinculando, setDesvinculando] = useState(false);

    if (!data) return <MensagemNenhumMembroSelecionado />;

    const grupos = [
        {
            titulo: "Dados Pessoais",
            campos: [
                { label: "Telefone", valor: data.telefone },
                { label: "Email", valor: data.email },
                { label: "Nascimento", valor: data.dataNascimento },
                { label: "Endereço", valor: data.endereco },
            ],
        },
        {
            titulo: "Dados Familiares",
            campos: [
                { label: "Estado Civil", valor: data.estadoCivil },
                { label: "Cônjuge", valor: data.conjuge },
                { label: "Filhos", valor: data.filhos },
            ],
        },
        {
            titulo: "Dados Ministeriais",
            campos: [
                { label: "Discípulo de", valor: data.discipulador },
                { label: "Discipulando", valor: data.discipulando },
                { label: "Ministério", valor: data.ministerio },
            ],
        },
    ];

    const handleEditar = () =>
        enqueueSnackbar("Funcionalidade disponível em breve!", { variant: "info", autoHideDuration: 2000 });

    const podeDesvincular =
        !!data.funcao && (FUNCOES_DESVINCULAVEIS as readonly PapelCelula[]).includes(data.funcao);

    async function handleConfirmarDesvinculo() {
        if (!data) return;
        try {
            setDesvinculando(true);
            await desvincularMembroDaCelula(data.vinculoId);
            setModalAberto(false);
            enqueueSnackbar("Membro desvinculado com sucesso!", { variant: "success", autoHideDuration: 2000 });
            onDesvincular?.();
        } catch (error: unknown) {
            enqueueSnackbar(
                error instanceof Error ? error.message : "Erro ao desvincular membro",
                { variant: "error", autoHideDuration: 3000 },
            );
        } finally {
            setDesvinculando(false);
        }
    }

    return (
        <Box
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.04)",
                bgcolor: "#fff",
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    height: { xs: 80, md: 100 },
                    background: "linear-gradient(135deg, #4A6499 0%, #5E79B3 40%, #7B95CC 100%)",
                    position: "relative",
                }}
            >
                {onBack && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            onClick={onBack}
                            sx={{
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                            }}
                        >
                            <IconArrowLeft size={22} />
                        </IconButton>
                        <Typography
                            sx={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.9)",
                                cursor: "pointer",
                            }}
                            onClick={onBack}
                        >
                            Voltar
                        </Typography>
                    </Box>
                )}
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        gap: 0.5,
                    }}
                >
                    {podeDesvincular && (
                        <Tooltip title="Desvincular da célula">
                            <IconButton
                                onClick={() => setModalAberto(true)}
                                sx={{
                                    color: "#fff",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                                }}
                            >
                                <IconUserMinus size={20} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Editar">
                        <IconButton
                            onClick={handleEditar}
                            sx={{
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                            }}
                        >
                            <IconPencil size={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Box sx={{ px: { xs: 3, md: 5 }, pb: { xs: 3, md: 5 } }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 3, md: 4 },
                        alignItems: { md: "flex-start" },
                    }}
                >
                    <InformacaoHeader
                        nome={data.nome}
                        funcao={data.funcao}
                        avatarUrl={data.avatarUrl}
                    />

                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            pt: { md: 7 },
                            pb: { md: 3 },
                        }}
                    >
                        {grupos.map((grupo, i) => (
                            <Box key={i} sx={{ flex: "1 1 220px", minWidth: 0 }}>
                                <InformacoesGroup
                                    titulo={grupo.titulo}
                                    campos={grupo.campos}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>

                <EtapasTabs membroId={data.id} />
            </Box>

            <ModalConfirmarDesvinculo
                open={modalAberto}
                nomeDoMembro={data.nome ?? "este membro"}
                loading={desvinculando}
                onClose={() => setModalAberto(false)}
                onConfirm={handleConfirmarDesvinculo}
            />
        </Box>
    );
}
