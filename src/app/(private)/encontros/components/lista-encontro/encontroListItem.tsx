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
                width: "330px",
                height: "90px",
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
                <Typography fontSize={16}>{encontro.tema}</Typography>
                <Divider
                    sx={{ borderColor: "#757575", mt: "2px", mb: "4px" }}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography
                        fontSize={12}
                        fontWeight={600}
                        sx={{ color: "#757575" }}
                    >
                        {dataFormatada}
                    </Typography>

                    <Box
                        sx={{
                            bgcolor: selected ? "#5E79B3" : "#DCE8E7",
                            color: selected ? "#FFFFFF" : "#1B212D",
                            borderRadius: "3px",
                            py: "0px",
                            px: "4px",
                        }}
                    >
                        <Typography fontSize={10} fontWeight={600}>
                            {encontro.numeroParticipantes} participantes
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </ListItemButton>
    );
}
