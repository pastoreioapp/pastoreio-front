import type { Encontro } from "@/modules/celulas/domain/encontro";
import { Box, ListItemButton, Typography } from "@mui/material";

export function EncontroListItem({
    encontro,
    selected,
    onClick,
}: {
    encontro: Encontro;
    selected: boolean;
    onClick: () => void;
}) {
    const dataFormatada = new Date(encontro.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const numeroParticipantes = encontro.frequencia?.filter(frequencia => frequencia.presente).length;

    return (
        <ListItemButton
            onClick={onClick}
            selected={selected}
            sx={{
                border: "1px solid #ECECEC",
                bgcolor: selected ? "rgba(94, 121, 179, 0.1)" : "#fff",
                borderRadius: "7px",
                mb: 1.5,
                py: 1.5,
                px: 2,
                gap: 2,
                width: "100%",
                maxWidth: { xs: "100%", md: "330px" },
                transition: "background-color 0.2s ease-in-out",
                "&:hover": {
                    backgroundColor: "rgba(94, 121, 179, 0.06)",
                },
                "&.Mui-selected": {
                    bgcolor: "rgba(94, 121, 179, 0.1)",
                    "&:hover": {
                        bgcolor: "rgba(94, 121, 179, 0.1)",
                    },
                },
            }}
        >
            <Box flex={1}>
                <Typography fontSize={16} sx={{ mb: 1 }}>Tema: {encontro.tema}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box
                        sx={{
                            bgcolor: "#5E79B3",
                            py: 0.3,
                            px: 1,
                            color: "#fff",
                            borderRadius: 1,
                            width: "fit-content",
                        }}
                    >
                        <Typography fontSize={10} fontWeight={600}>
                            {numeroParticipantes} participante{numeroParticipantes === 1 ? "" : "s"}
                        </Typography>
                    </Box>
                    <Typography
                        fontSize={12}
                        fontWeight={600}
                        sx={{ color: "#757575" }}
                    >
                        {dataFormatada}
                    </Typography>
                </Box>
            </Box>
        </ListItemButton>
    );
}
