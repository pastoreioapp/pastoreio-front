"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Chip,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
    IconAlertCircleFilled,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconMessage2,
    IconUsersGroup,
} from "@tabler/icons-react";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import type { Frequencia as FrequenciaDomain } from "@/modules/celulas/domain/frequencia";

type Situacao = "Presente" | "Justificado" | "Faltou";
type FiltroAtivo = "todos" | "presentes" | "justificados" | "faltas";
type FrequenciaParaListagem = FrequenciaDomain & { membro_nome?: string };

const SITUACAO_CONFIG: Record<
    Situacao,
    { label: string; cor: string; bgCor: string; Icon: typeof IconCircleCheckFilled }
> = {
    Presente: {
        label: "Presente",
        cor: "#16A34A",
        bgCor: "rgba(22, 163, 74, 0.1)",
        Icon: IconCircleCheckFilled,
    },
    Justificado: {
        label: "Justificado",
        cor: "#F59E0B",
        bgCor: "rgba(245, 158, 11, 0.1)",
        Icon: IconAlertCircleFilled,
    },
    Faltou: {
        label: "Faltou",
        cor: "#EF4444",
        bgCor: "rgba(239, 68, 68, 0.1)",
        Icon: IconCircleXFilled,
    },
};

const ORDEM_SITUACAO: Record<Situacao, number> = {
    Faltou: 0,
    Justificado: 1,
    Presente: 2,
};

function getSituacao(item: FrequenciaDomain): Situacao {
    if (item.presente) return "Presente";
    if (item.justificado) return "Justificado";
    return "Faltou";
}

export function Frequencia({ data }: { data: Encontro["frequencia"] }) {
    const [search, setSearch] = useState("");
    const [filtro, setFiltro] = useState<FiltroAtivo>("todos");

    const itens = useMemo(
        () => (data ?? []) as FrequenciaParaListagem[],
        [data]
    );

    const totais = useMemo(() => {
        const total = itens.length;
        const presentes = itens.filter((i) => i.presente).length;
        const justificados = itens.filter(
            (i) => !i.presente && i.justificado
        ).length;
        const faltas = total - presentes - justificados;
        const taxaPresenca =
            total > 0 ? Math.round((presentes / total) * 100) : 0;
        return { total, presentes, justificados, faltas, taxaPresenca };
    }, [itens]);

    const itensVisiveis = useMemo(() => {
        const termo = search.trim().toLowerCase();
        const filtrados = itens.filter((item) => {
            const situacao = getSituacao(item);
            const nome = item.membro_nome ?? "";
            if (termo && !nome.toLowerCase().includes(termo)) return false;
            if (filtro === "presentes") return situacao === "Presente";
            if (filtro === "justificados") return situacao === "Justificado";
            if (filtro === "faltas") return situacao === "Faltou";
            return true;
        });

        return [...filtrados].sort((a, b) => {
            const sitA = ORDEM_SITUACAO[getSituacao(a)];
            const sitB = ORDEM_SITUACAO[getSituacao(b)];
            if (sitA !== sitB) return sitA - sitB;
            return (a.membro_nome ?? "").localeCompare(b.membro_nome ?? "");
        });
    }, [itens, search, filtro]);

    if (!data || data.length === 0) {
        return (
            <Box
                sx={{
                    border: "2px dashed #DEE3EA",
                    borderRadius: 3,
                    py: 6,
                    px: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    width: "100%",
                    maxWidth: 720,
                    mx: "auto",
                }}
            >
                <IconUsersGroup size={48} stroke={1.5} color="#5A6A85" />
                <Typography sx={{ color: "text.secondary", fontSize: "16px" }}>
                    Nenhum registro de frequência para este encontro.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", maxWidth: 720, mx: "auto" }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr 1fr",
                        sm: "repeat(4, 1fr)",
                    },
                    gap: 1.5,
                    mb: 2.5,
                }}
            >
                <ResumoCard
                    titulo="Total"
                    valor={totais.total}
                    icone={<IconUsersGroup size={18} />}
                    cor="#5E79B3"
                    bgCor="rgba(94, 121, 179, 0.1)"
                />
                <ResumoCard
                    titulo="Presentes"
                    valor={totais.presentes}
                    icone={<IconCircleCheckFilled size={18} />}
                    cor={SITUACAO_CONFIG.Presente.cor}
                    bgCor={SITUACAO_CONFIG.Presente.bgCor}
                />
                <ResumoCard
                    titulo="Justificados"
                    valor={totais.justificados}
                    icone={<IconAlertCircleFilled size={18} />}
                    cor={SITUACAO_CONFIG.Justificado.cor}
                    bgCor={SITUACAO_CONFIG.Justificado.bgCor}
                />
                <ResumoCard
                    titulo="Faltas"
                    valor={totais.faltas}
                    icone={<IconCircleXFilled size={18} />}
                    cor={SITUACAO_CONFIG.Faltou.cor}
                    bgCor={SITUACAO_CONFIG.Faltou.bgCor}
                />
            </Box>

            <Box sx={{ mb: 2.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.75,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.78rem",
                            color: "text.secondary",
                            fontWeight: 600,
                        }}
                    >
                        Taxa de presença
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "0.85rem",
                            color: "#000",
                            fontWeight: 700,
                        }}
                    >
                        {totais.taxaPresenca}%
                    </Typography>
                </Box>
                <Box
                    role="progressbar"
                    aria-valuenow={totais.taxaPresenca}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    sx={{
                        height: 6,
                        bgcolor: "#F5F5F5",
                        borderRadius: 999,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                            width: `${totais.taxaPresenca}%`,
                            bgcolor: "#5E79B3",
                            transition: "width 0.3s ease",
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ mb: 1.5 }}>
                <TextField
                    aria-label="Pesquisar membro"
                    variant="outlined"
                    placeholder="Pesquisar membro"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "40px",
                            backgroundColor: "#F8F8F8",
                            borderRadius: 2,
                            "& fieldset": { borderColor: "#F5F5F5" },
                            "&:hover fieldset": { borderColor: "#E0E0E0" },
                            "&.Mui-focused fieldset": {
                                borderColor: "#5E79B3",
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: "#929EAE",
                                opacity: 1,
                                fontSize: ".9rem",
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search
                                    sx={{
                                        width: 22,
                                        height: 22,
                                        color: "#929EAE",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 0.75,
                    flexWrap: "wrap",
                    mb: 2,
                }}
            >
                <FiltroChip
                    ativo={filtro === "todos"}
                    label="Todos"
                    contagem={totais.total}
                    onClick={() => setFiltro("todos")}
                />
                <FiltroChip
                    ativo={filtro === "presentes"}
                    label="Presentes"
                    contagem={totais.presentes}
                    cor={SITUACAO_CONFIG.Presente.cor}
                    onClick={() => setFiltro("presentes")}
                />
                <FiltroChip
                    ativo={filtro === "justificados"}
                    label="Justificados"
                    contagem={totais.justificados}
                    cor={SITUACAO_CONFIG.Justificado.cor}
                    onClick={() => setFiltro("justificados")}
                />
                <FiltroChip
                    ativo={filtro === "faltas"}
                    label="Faltas"
                    contagem={totais.faltas}
                    cor={SITUACAO_CONFIG.Faltou.cor}
                    onClick={() => setFiltro("faltas")}
                />
            </Box>

            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    borderColor: "#ECECEC",
                }}
            >
                {itensVisiveis.length === 0 ? (
                    <Box
                        sx={{
                            py: 5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontSize: "0.9rem",
                            }}
                        >
                            Nenhum membro encontrado.
                        </Typography>
                    </Box>
                ) : (
                    itensVisiveis.map((item, index) => (
                        <FrequenciaItem
                            key={item.id ?? `${item.membro_id}-${index}`}
                            item={item}
                            isUltimo={index === itensVisiveis.length - 1}
                        />
                    ))
                )}
            </Paper>
        </Box>
    );
}

function FrequenciaItem({
    item,
    isUltimo,
}: {
    item: FrequenciaParaListagem;
    isUltimo: boolean;
}) {
    const situacao = getSituacao(item);
    const config = SITUACAO_CONFIG[situacao];
    const SituacaoIcon = config.Icon;
    const nomeExibicao = item.membro_nome ?? `Membro #${item.membro_id}`;
    const exibirJustificativa =
        situacao === "Justificado" && Boolean(item.justificativa);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                px: { xs: 1.5, sm: 2.5 },
                py: 1.5,
                borderBottom: isUltimo ? "none" : "1px solid #ECECEC",
                transition: "background-color 0.15s ease",
                "&:hover": {
                    bgcolor: "rgba(94, 121, 179, 0.03)",
                },
            }}
        >
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: "0.95rem",
                        color: "#000",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {nomeExibicao}
                </Typography>
                {exibirJustificativa && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 0.5,
                            mt: 0.5,
                        }}
                    >
                        <Box
                            sx={{
                                color: "text.secondary",
                                display: "flex",
                                mt: "2px",
                                flexShrink: 0,
                            }}
                        >
                            <IconMessage2 size={14} />
                        </Box>
                        <Typography
                            sx={{
                                fontSize: "0.78rem",
                                color: "text.secondary",
                                fontStyle: "italic",
                                lineHeight: 1.4,
                            }}
                        >
                            {item.justificativa}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Chip
                icon={
                    <Box
                        component="span"
                        sx={{
                            display: "flex",
                            color: `${config.cor} !important`,
                        }}
                    >
                        <SituacaoIcon size={14} />
                    </Box>
                }
                label={config.label}
                size="small"
                sx={{
                    bgcolor: config.bgCor,
                    color: config.cor,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    height: 26,
                    borderRadius: 999,
                    flexShrink: 0,
                    "& .MuiChip-icon": {
                        ml: "8px",
                        mr: "-4px",
                    },
                    "& .MuiChip-label": {
                        px: 1,
                    },
                }}
            />
        </Box>
    );
}

function ResumoCard({
    titulo,
    valor,
    icone,
    cor,
    bgCor,
}: {
    titulo: string;
    valor: number;
    icone: React.ReactNode;
    cor: string;
    bgCor: string;
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                bgcolor: "#fff",
                borderColor: "#ECECEC",
            }}
        >
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: bgCor,
                    color: cor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icone}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: "0.68rem",
                        color: "text.secondary",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: 1.2,
                    }}
                >
                    {titulo}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: "#000",
                        lineHeight: 1.2,
                    }}
                >
                    {valor}
                </Typography>
            </Box>
        </Paper>
    );
}

function FiltroChip({
    label,
    contagem,
    ativo,
    cor,
    onClick,
}: {
    label: string;
    contagem: number;
    ativo: boolean;
    cor?: string;
    onClick: () => void;
}) {
    const corBase = cor ?? "#5E79B3";
    return (
        <Chip
            label={`${label} · ${contagem}`}
            onClick={onClick}
            size="small"
            sx={{
                fontSize: "0.78rem",
                fontWeight: 600,
                height: 30,
                borderRadius: 999,
                cursor: "pointer",
                bgcolor: ativo ? corBase : "#F5F5F5",
                color: ativo ? "#fff" : "text.secondary",
                border: ativo ? `1px solid ${corBase}` : "1px solid #ECECEC",
                transition: "all 0.15s ease",
                "&:hover": {
                    bgcolor: ativo ? corBase : "#ECECEC",
                },
                "& .MuiChip-label": {
                    px: 1.25,
                },
            }}
        />
    );
}
