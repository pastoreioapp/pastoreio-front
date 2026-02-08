import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";
import {
    Avatar,
    Box,
    Divider,
    ListItemAvatar,
    ListItemButton,
    Typography,
} from "@mui/material";

export function MembroListItem({
    membro,
    selected,
    onClick,
}: {
    membro: MembroListItemDto;
    selected: boolean;
    onClick: () => void;
}) {
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
                maxWidth: "330px",
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
            <ListItemAvatar>
                <Avatar sx={{ width: 60, height: 60 }}>
                    {membro.nome ? membro.nome.charAt(0).toUpperCase() : "?"}
                </Avatar>
            </ListItemAvatar>
            <Box flex={1}>
                <Typography fontSize={16}>{membro.nome}</Typography>
                <Divider
                    sx={{ borderColor: "#C5C5C5", mt: "2px", mb: "4px" }}
                />
                <Typography color="#686868" fontSize={".8rem"} fontWeight={800}>
                    {membro.funcao}
                </Typography>
            </Box>
        </ListItemButton>
    );
}
