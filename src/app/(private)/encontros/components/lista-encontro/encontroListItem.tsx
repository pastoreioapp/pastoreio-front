import type { Encontro } from "@/modules/celulas/domain/encontro";
import { Box, Divider, ListItemButton, Typography } from "@mui/material";

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
                bgcolor: selected ? "#DCE8E7" : "#fff",
                borderRadius: "7px",
                mb: "15px",
                py: "15px",
                px: "15.32px",
                gap: "17px",
                width: "100%",
                maxWidth: { xs: "100%", md: "330px" },
                height: "100px",
                transition: "background-color 0.2s ease-in-out",
                "&:hover": {
                    backgroundColor: "#DCE8E7",
                },
                "&.Mui-selected": {
                    bgcolor: "#DCE8E7",
                    "&:hover": {
                        bgcolor: "#DCE8E7",
                    },
                },
            }}
        >
            <Box flex={1}>
                <Typography fontSize={16} sx={{ mb: 1}}>Tema: {encontro.tema}</Typography>
                <Divider 
                    sx={{ borderColor: "#C5C5C5", mt: "2px", mb: "4px" }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                    <Box
                        sx={{
                            bgcolor:"#5E79B3",
                            mt: 1,
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
