"use client";

import { useMemo } from "react";
import {
    Box,
    Dialog,
    IconButton,
    LinearProgress,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    IconCalendarHeart,
    IconHeartHandshake,
    IconTarget,
    IconX,
} from "@tabler/icons-react";
import type { SaudeCelulaResult } from "@/modules/celulas/application/saude-dtos";
import type { PulsoSemanaResult } from "@/modules/celulas/application/dashboard-dtos";
import type { MembroEmAtencaoResult } from "@/modules/celulas/application/atencao-dtos";
import type { MetaCelulaDto } from "@/modules/metas/application/dtos";
import {
    calcularPilares,
    PESOS_SAUDE,
    type PilarSaude,
    type StatusPilar,
} from "@/modules/celulas/application/saude-celula.calc";
import { CARD_STYLE, DANGER, FOCUS_OUTLINE, SUCCESS, WARNING } from "../lib/tokens";
import { SAUDE_VARIANTES, variantePorClasse } from "../lib/saude-variantes";

type Props = {
    open: boolean;
    onClose: () => void;
    saude: SaudeCelulaResult;
    pulso: PulsoSemanaResult;
    membrosAtencao: MembroEmAtencaoResult[];
    metas: MetaCelulaDto[];
};

const STATUS_COR: Record<StatusPilar, string> = {
    bom: SUCCESS,
    atencao: WARNING,
    ruim: DANGER,
};

const CLASSE_LABEL: Record<SaudeCelulaResult["classe"], string> = {
    florescendo: "Florescendo",
    saudavel: "Saudável",
    atencao: "Em atenção",
    critica: "Crítica",
};

function formatPeso(peso: number) {
    return `Peso ${Math.round(peso * 100)}%`;
}

type PilarConfig = {
    chave: "presenca" | "pastoreio" | "metas";
    titulo: string;
    icone: React.ReactNode;
    descricao: (pilar: PilarSaude, ctx: PilarContexto) => string;
    microcopy: string;
};

type PilarContexto = {
    pulso: PulsoSemanaResult;
    membrosAtencao: MembroEmAtencaoResult[];
    metas: MetaCelulaDto[];
};

function descricaoPresenca(pilar: PilarSaude, { pulso }: PilarContexto): string {
    const totalEncontros = pulso.historico.length;
    if (totalEncontros === 0) {
        return "Ainda sem encontros lançados.";
    }
    const { numerador, denominador } = pilar.detalhe;
    if (denominador === 0) {
        return "Sem registros de frequência no último encontro.";
    }
    const pluralPessoas = denominador === 1 ? "pessoa" : "pessoas";
    return `${numerador} de ${denominador} ${pluralPessoas} presentes no último encontro.`;
}

function descricaoPastoreio(pilar: PilarSaude, { membrosAtencao }: PilarContexto): string {
    const criticos = pilar.detalhe.numerador;
    const total = pilar.detalhe.denominador;
    if (membrosAtencao.length === 0 && criticos === 0) {
        return "Nenhum membro em estado crítico no momento.";
    }
    const pluralMembros = total === 1 ? "membro" : "membros";
    if (criticos === 0) {
        return `Nenhum dos ${total} ${pluralMembros} está em estado crítico.`;
    }
    if (criticos === 1) {
        return `1 de ${total} ${pluralMembros} está em estado crítico.`;
    }
    return `${criticos} de ${total} ${pluralMembros} estão em estado crítico.`;
}

function descricaoMetas(pilar: PilarSaude, { metas }: PilarContexto): string {
    if (metas.length === 0) {
        return "Nenhuma meta definida para o período atual.";
    }
    const media = Math.round(pilar.score);
    return `Você atingiu ${media}% das metas em média.`;
}

const PILARES_CONFIG: PilarConfig[] = [
    {
        chave: "presenca",
        titulo: "Presença",
        icone: <IconCalendarHeart size={20} stroke={1.8} />,
        descricao: descricaoPresenca,
        microcopy: "A presença regular indica engajamento.",
    },
    {
        chave: "pastoreio",
        titulo: "Pastoreio",
        icone: <IconHeartHandshake size={20} stroke={1.8} />,
        descricao: descricaoPastoreio,
        microcopy: "Cuidar individualmente reduz desistências.",
    },
    {
        chave: "metas",
        titulo: "Metas",
        icone: <IconTarget size={20} stroke={1.8} />,
        descricao: descricaoMetas,
        microcopy: "Metas claras dão direção ao crescimento.",
    },
];

function PilarRow({
    titulo,
    icone,
    pilar,
    descricao,
    microcopy,
}: {
    titulo: string;
    icone: React.ReactNode;
    pilar: PilarSaude;
    descricao: string;
    microcopy: string;
}) {
    const cor = STATUS_COR[pilar.status];
    const scoreArredondado = Math.round(pilar.score);

    return (
        <Box
            component="article"
            sx={{
                ...CARD_STYLE,
                p: { xs: 2, md: 2.5 },
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    aria-hidden="true"
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: `${cor}1A`,
                        color: cor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {icone}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#2F323A" }}>
                        {titulo}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "text.secondary",
                        }}
                    >
                        {formatPeso(pilar.peso)}
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: cor,
                        lineHeight: 1,
                        flexShrink: 0,
                    }}
                    aria-label={`Pontuação do pilar ${titulo}: ${scoreArredondado} de 100`}
                >
                    {scoreArredondado}
                    <Typography
                        component="span"
                        sx={{ fontSize: "0.8rem", color: "text.secondary", fontWeight: 500, ml: 0.25 }}
                    >
                        /100
                    </Typography>
                </Typography>
            </Box>

            <LinearProgress
                variant="determinate"
                value={Math.min(scoreArredondado, 100)}
                aria-hidden="true"
                sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: `${cor}1F`,
                    "& .MuiLinearProgress-bar": {
                        bgcolor: cor,
                        borderRadius: 3,
                    },
                }}
            />

            <Typography sx={{ fontSize: "0.85rem", color: "#2F323A", lineHeight: 1.45 }}>
                {descricao}
            </Typography>
            <Typography
                sx={{
                    fontSize: "0.78rem",
                    color: "text.secondary",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                }}
            >
                {microcopy}
            </Typography>
        </Box>
    );
}

export function SaudeCelulaDetalhesModal({
    open,
    onClose,
    saude,
    pulso,
    membrosAtencao,
    metas,
}: Props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const tokens = SAUDE_VARIANTES[variantePorClasse(saude.classe)];

    const pilares = useMemo(
        () => calcularPilares(pulso, membrosAtencao, metas),
        [pulso, membrosAtencao, metas],
    );

    const titleId = "saude-celula-detalhes-titulo";
    const descId = "saude-celula-detalhes-descricao";

    const ctx: PilarContexto = { pulso, membrosAtencao, metas };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            fullWidth
            maxWidth="sm"
            aria-labelledby={titleId}
            aria-describedby={descId}
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, sm: 3 },
                    overflow: "hidden",
                },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    background: tokens.background,
                    color: "#fff",
                    px: { xs: 3, md: 4 },
                    pt: { xs: 3, md: 3.5 },
                    pb: { xs: 3, md: 3.5 },
                }}
            >
                <IconButton
                    onClick={onClose}
                    aria-label="Fechar detalhes da saúde da célula"
                    autoFocus
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                        ...FOCUS_OUTLINE,
                    }}
                >
                    <IconX size={20} stroke={2} />
                </IconButton>

                <Typography
                    id={titleId}
                    component="h2"
                    sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        opacity: 0.9,
                        mb: 1.5,
                    }}
                >
                    Saúde da célula
                </Typography>

                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.25, mb: 0.75 }}>
                    <Typography
                        component="span"
                        sx={{
                            fontSize: { xs: "3rem", md: "3.5rem" },
                            fontWeight: 800,
                            lineHeight: 1,
                        }}
                    >
                        {saude.score}
                    </Typography>
                    <Typography
                        component="span"
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            opacity: 0.85,
                        }}
                    >
                        /100
                    </Typography>
                    <Box
                        sx={{
                            ml: 1,
                            bgcolor: tokens.chipBg,
                            borderRadius: 2,
                            px: 1.25,
                            py: 0.5,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                        }}
                    >
                        {CLASSE_LABEL[saude.classe]}
                    </Box>
                </Box>

                <Typography
                    sx={{
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        fontWeight: 600,
                        lineHeight: 1.35,
                        maxWidth: 360,
                    }}
                >
                    {saude.mensagem}
                </Typography>
            </Box>

            <Box
                sx={{
                    px: { xs: 2.5, md: 3.5 },
                    py: { xs: 2.5, md: 3 },
                    bgcolor: "#F8F9FB",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography
                    id={descId}
                    sx={{ fontSize: "0.85rem", color: "text.secondary", lineHeight: 1.45 }}
                >
                    Sua saúde é calculada a partir de 3 pilares. Veja abaixo o que está
                    contribuindo para o resultado de hoje.
                </Typography>

                {PILARES_CONFIG.map((cfg) => {
                    const pilar = pilares[cfg.chave];
                    return (
                        <PilarRow
                            key={cfg.chave}
                            titulo={cfg.titulo}
                            icone={cfg.icone}
                            pilar={pilar}
                            descricao={cfg.descricao(pilar, ctx)}
                            microcopy={cfg.microcopy}
                        />
                    );
                })}

                <Typography
                    sx={{
                        fontSize: "0.82rem",
                        fontStyle: "italic",
                        textAlign: "center",
                        color: "text.secondary",
                        lineHeight: 1.5,
                        mt: 0.5,
                    }}
                >
                    {saude.versiculo}
                </Typography>
            </Box>
        </Dialog>
    );
}
