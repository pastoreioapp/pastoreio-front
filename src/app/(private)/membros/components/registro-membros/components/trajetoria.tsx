"use client";

import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
} from "@mui/material";

const colors = {
    greenPrimary: "#86C18B",
    greenBackground: "#F3FAF4",
    greenBorder: "#E2F0E5",
    greyLine: "#E5E7EB",
    greyText: "#4B5563",
    lightGreyText: "#9CA3AF",
    lightGreyBorder: "#F3F4F6",
};

export const initialFases = [
    {
        id: 1,
        title: "Pastoreio 1",
        items: [
            { label: "Assíduo no culto", checked: true },
            { label: "Assíduo na Célula", checked: true },
            { label: "Livro Acomp. Inicial", checked: true },
            { label: "Café com Pastor", checked: true },
            { label: "Estação DNA", checked: true },
            { label: "Curso Nova Criatura", checked: true },
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

export const calculateState = (fases: any[]) => {
    let previousCompleted = true;
    return fases.map((fase) => {
        const isCompleted = fase.items.every((item: any) => item.checked);
        const active = previousCompleted;
        const disabled = !previousCompleted;
        const lineAfterIsActive = isCompleted;
        previousCompleted = previousCompleted && isCompleted;

        return { ...fase, active, disabled, lineAfterIsActive };
    });
};

interface TrajetoriaProps {
    fasesList: any[];
    setFasesList: (list: any[]) => void;
}

export function Trajetoria({ fasesList, setFasesList }: TrajetoriaProps) {
    const handleToggle = (faseIndex: number, itemIndex: number) => {
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 5,
                    width: "100%",
                }}
            >
                {fasesList.map((fase, index) => {
                    const isFirst = index === 0;
                    const isLast = index === fasesList.length - 1;
                    const leftLineColor = isFirst
                        ? "transparent"
                        : fasesList[index - 1].lineAfterIsActive
                          ? colors.greenPrimary
                          : colors.greyLine;
                    const rightLineColor = isLast
                        ? "transparent"
                        : fase.lineAfterIsActive
                          ? colors.greenPrimary
                          : colors.greyLine;

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
                                    transition:
                                        "background-color 0.4s ease-in-out",
                                }}
                            />
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    minWidth: 36,
                                    borderRadius: "50%",
                                    backgroundColor: fase.active
                                        ? colors.greenPrimary
                                        : "#F3F4F6",
                                    color: fase.active
                                        ? "#FFFFFF"
                                        : colors.lightGreyText,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    zIndex: 1,
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
                                    transition:
                                        "background-color 0.4s ease-in-out",
                                }}
                            />
                        </Box>
                    );
                })}
            </Box>
            <Grid
                container
                spacing={3}
                sx={{ flexGrow: 1, alignItems: "stretch" }}
            >
                {fasesList.map((fase, faseIndex) => (
                    <Grid item xs={12} sm={6} md={3} key={fase.id}>
                        <Box
                            sx={{
                                backgroundColor: fase.active
                                    ? colors.greenBackground
                                    : "#FFFFFF",
                                border: "1px solid",
                                borderColor: fase.active
                                    ? colors.greenBorder
                                    : colors.lightGreyBorder,
                                borderRadius: 3,
                                p: { xs: 2, md: 3 },
                                height: "100%",
                                transition: "all 0.4s ease-in-out",
                                opacity: fase.disabled ? 0.7 : 1,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    transition: "color 0.4s ease-in-out",
                                    color: fase.disabled
                                        ? colors.lightGreyText
                                        : fase.active
                                          ? colors.greenPrimary
                                          : "#1F2937",
                                }}
                            >
                                {fase.title}
                            </Typography>
                            <FormGroup>
                                {fase.items.map(
                                    (item: any, itemIndex: number) => (
                                        <FormControlLabel
                                            key={itemIndex}
                                            sx={{
                                                mb: 1,
                                                ml: 0,
                                                alignItems: "flex-start",
                                            }}
                                            control={
                                                <Checkbox
                                                    checked={item.checked}
                                                    onChange={() =>
                                                        handleToggle(
                                                            faseIndex,
                                                            itemIndex,
                                                        )
                                                    }
                                                    disabled={fase.disabled}
                                                    size="small"
                                                    disableRipple
                                                    sx={{
                                                        p: 0,
                                                        pr: 1,
                                                        pt: "2px",
                                                        transition:
                                                            "color 0.3s ease-in-out",
                                                        color: fase.disabled
                                                            ? colors.lightGreyBorder
                                                            : "#D1D5DB",
                                                        "&.Mui-checked": {
                                                            color: fase.disabled
                                                                ? colors.lightGreyBorder
                                                                : colors.greenPrimary,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: item.checked
                                                            ? 600
                                                            : 500,
                                                        transition:
                                                            "color 0.3s ease-in-out",
                                                        color: fase.disabled
                                                            ? colors.lightGreyText
                                                            : colors.greyText,
                                                        fontSize: "0.875rem",
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                    {item.label}
                                                </Typography>
                                            }
                                        />
                                    ),
                                )}
                            </FormGroup>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
