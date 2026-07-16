"use client";

import { CheckCircle } from "@mui/icons-material";
import {
    Box,
    Checkbox,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconCheck } from "@tabler/icons-react";

type TrajetoriaItem = {
    id?: number;
    label: string;
    checked: boolean;
};

type TrajetoriaFase = {
    id: number;
    title: string;
    items: TrajetoriaItem[];
    active?: boolean;
    disabled?: boolean;
    lineAfterIsActive?: boolean;
};

export const initialFases: TrajetoriaFase[] = [
    {
        id: 1,
        title: "Pastoreio 1",
        items: [
            { label: "Assíduo no culto", checked: false },
            { label: "Assíduo na Célula", checked: false },
            { label: "Livro Acomp. Inicial", checked: false },
            { label: "Café com Pastor", checked: false },
            { label: "Estação DNA", checked: false },
            { label: "Curso Nova Criatura", checked: false },
            { label: "Batismo nas Águas", checked: false },
        ],
    },
    {
        id: 2,
        title: "Pastoreio 2",
        items: [
            { label: "Curso Vida Devocional", checked: false },
            { label: "Curso Aut. e Submissão", checked: false },
            { label: "Curso Família Cristã", checked: false },
            { label: "Servir em Ministério", checked: false },
            { label: "Encontro com Deus", checked: false },
        ],
    },
    {
        id: 3,
        title: "Discipulado",
        items: [
            { label: "Assíduo no Tadel", checked: false },
            { label: "Curso Ide e Fazei Discípulos", checked: false },
            { label: "Expresso 1", checked: false },
        ],
    },
    {
        id: 4,
        title: "Líder de Célula",
        items: [
            { label: "Curso TLC", checked: false },
            { label: "Expresso 2", checked: false },
            { label: "Aprovação do Pastor", checked: false },
        ],
    },
];

export const calculateState = (fases: TrajetoriaFase[]): TrajetoriaFase[] => {
    let previousCompleted = true;

    return fases.map((fase) => {
        const items = Array.isArray(fase.items) ? fase.items : [];
        const isCompleted =
            items.length > 0 && items.every((item) => item.checked);

        const active = previousCompleted;
        const disabled = !previousCompleted;
        const lineAfterIsActive = isCompleted;

        previousCompleted = previousCompleted && isCompleted;

        return {
            ...fase,
            active,
            disabled,
            lineAfterIsActive,
        };
    });
};

function AnelProgresso({
    valor,
    etapa,
    concluida,
    disabled,
}: {
    valor: number;
    etapa: number;
    concluida: boolean;
    disabled: boolean;
}) {
    const theme = useTheme();

    const cor = concluida
        ? theme.palette.success.main
        : disabled
          ? "#DDE3EA"
          : theme.palette.primary.main;

    return (
        <Box sx={{ position: "relative", display: "inline-flex", mb: 1.5 }}>
            <CircularProgress
                variant="determinate"
                value={100}
                size={56}
                thickness={3}
                sx={{ color: "#EAEEF2", position: "absolute" }}
            />

            <CircularProgress
                variant="determinate"
                value={valor}
                size={56}
                thickness={3}
                sx={{
                    color: cor,
                    "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                        transition: "stroke-dashoffset 0.6s ease",
                    },
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {concluida ? (
                    <IconCheck size={22} stroke={2.5} color={cor} />
                ) : (
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: disabled
                                ? "#AEB7C4"
                                : theme.palette.text.secondary,
                        }}
                    >
                        {etapa}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function EtapaCadastroCard({
    etapa,
    titulo,
    itens,
    disabled,
    onToggle,
}: {
    etapa: number;
    titulo: string;
    itens: TrajetoriaItem[];
    disabled: boolean;
    onToggle: (itemIndex: number) => void;
}) {
    const theme = useTheme();

    const totalConcluidos = itens.filter((item) => item.checked).length;
    const isConcluida = itens.length > 0 && totalConcluidos === itens.length;
    const progresso =
        itens.length > 0 ? (totalConcluidos / itens.length) * 100 : 0;

    return (
        <Paper
            variant="outlined"
            sx={{
                width: { xs: "100%", sm: "250px" },
                minHeight: 360,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: isConcluida ? "#F1F8F1" : "#FAFBFC",
                border: isConcluida ? "2px solid" : "1px solid",
                borderColor: isConcluida ? "#7fb77e4d" : "divider",
                p: 3,
                opacity: disabled ? 0.62 : 1,
                transition:
                    "border-color 0.3s, background-color 0.3s, opacity 0.3s",
            }}
        >
            <AnelProgresso
                valor={progresso}
                etapa={etapa}
                concluida={isConcluida}
                disabled={disabled}
            />

            <Typography
                sx={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: disabled
                        ? theme.palette.text.disabled
                        : theme.palette.text.primary,
                    mb: 0.25,
                    textAlign: "center",
                }}
            >
                {titulo}
            </Typography>

            <Typography
                sx={{
                    fontSize: "0.7rem",
                    fontWeight: isConcluida ? 800 : 500,
                    color: isConcluida
                        ? theme.palette.success.main
                        : theme.palette.text.secondary,
                    mb: 2,
                }}
            >
                {isConcluida
                    ? "Concluída"
                    : `${totalConcluidos} de ${itens.length} concluídos`}
            </Typography>

            <Stack spacing={0} sx={{ width: "100%" }}>
                {itens.map((item, itemIndex) => (
                    <Box
                        key={`${item.label}-${itemIndex}`}
                        display="flex"
                        alignItems="center"
                        sx={{
                            py: 0.25,
                            borderRadius: 1,
                        }}
                    >
                        <Checkbox
                            checked={item.checked}
                            disabled={disabled}
                            onChange={() => onToggle(itemIndex)}
                            size="small"
                            disableRipple
                            icon={
                                <Box
                                    sx={{
                                        border: "1.5px solid",
                                        borderColor: disabled
                                            ? "#DDE3EA"
                                            : "#C5C5C5",
                                        width: 16,
                                        height: 16,
                                        borderRadius: "4px",
                                    }}
                                />
                            }
                            checkedIcon={
                                <CheckCircle
                                    sx={{
                                        fontSize: "1.25rem",
                                        color: disabled
                                            ? "#DDE3EA"
                                            : theme.palette.success.main,
                                    }}
                                />
                            }
                            sx={{ p: 0.5 }}
                        />

                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                color: disabled
                                    ? theme.palette.text.disabled
                                    : item.checked
                                      ? theme.palette.text.secondary
                                      : theme.palette.text.primary,
                                textDecoration: item.checked
                                    ? "line-through"
                                    : "none",
                                ml: 0.5,
                                lineHeight: 1.35,
                            }}
                        >
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}

function TrajetoriaStepper({ fasesList }: { fasesList: TrajetoriaFase[] }) {
    const stepperColors = {
        greenPrimary: "#86C18B",
        greyLine: "#E5E7EB",
        lightGreyText: "#9CA3AF",
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                mb: 4.5,
                width: "100%",
                maxWidth: 980,
                mx: "auto",
            }}
        >
            {fasesList.map((fase, index) => {
                const isFirst = index === 0;
                const isLast = index === fasesList.length - 1;

                const leftLineColor = isFirst
                    ? "transparent"
                    : fasesList[index - 1]?.lineAfterIsActive
                      ? stepperColors.greenPrimary
                      : stepperColors.greyLine;

                const rightLineColor = isLast
                    ? "transparent"
                    : fase.lineAfterIsActive
                      ? stepperColors.greenPrimary
                      : stepperColors.greyLine;

                return (
                    <Box
                        key={fase.id}
                        sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                height: "2px",
                                backgroundColor: leftLineColor,
                                mr: 1,
                                transition: "background-color 0.4s ease-in-out",
                            }}
                        />

                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                minWidth: 36,
                                borderRadius: "50%",
                                backgroundColor: fase.active
                                    ? stepperColors.greenPrimary
                                    : "#F3F4F6",
                                color: fase.active
                                    ? "#FFFFFF"
                                    : stepperColors.lightGreyText,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                zIndex: 1,
                                boxShadow: fase.active
                                    ? "0 6px 14px rgba(134, 193, 139, 0.28)"
                                    : "none",
                                transition: "all 0.4s ease-in-out",
                            }}
                        >
                            {fase.id}
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                height: "2px",
                                backgroundColor: rightLineColor,
                                ml: 1,
                                transition: "background-color 0.4s ease-in-out",
                            }}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}

interface TrajetoriaProps {
    fasesList: TrajetoriaFase[];
    setFasesList: (list: TrajetoriaFase[]) => void;
}

export function Trajetoria({ fasesList, setFasesList }: TrajetoriaProps) {
    const handleToggle = (faseIndex: number, itemIndex: number) => {
        const faseAtual = fasesList[faseIndex];

        if (faseAtual.disabled) return;

        const newFasesList = [...fasesList];
        const updatedFase = { ...newFasesList[faseIndex] };
        const updatedItems = [...updatedFase.items];

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            checked: !updatedItems[itemIndex].checked,
        };

        updatedFase.items = updatedItems;
        newFasesList[faseIndex] = updatedFase;

        setFasesList(calculateState(newFasesList));
    };

    return (
        <Box
            sx={{
                px: { xs: 2, sm: 4, md: 6.5 },
                pb: 6,
                pt: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <TrajetoriaStepper fasesList={fasesList} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 2,
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                {fasesList.map((fase, faseIndex) => (
                    <EtapaCadastroCard
                        key={fase.id}
                        etapa={fase.id}
                        titulo={fase.title}
                        itens={fase.items}
                        disabled={Boolean(fase.disabled)}
                        onToggle={(itemIndex) =>
                            handleToggle(faseIndex, itemIndex)
                        }
                    />
                ))}
            </Box>
        </Box>
    );
}
