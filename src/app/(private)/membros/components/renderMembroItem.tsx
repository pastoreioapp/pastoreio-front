import { Membro } from "@/features/membros/types";
import {
    Avatar,
    Box,
    Divider,
    ListItem,
    ListItemAvatar,
    Typography,
} from "@mui/material";

export function renderMembroItem(
    membro: Membro,
    index: number,
    onClick?: () => void
) {
    return (
        <ListItem
            key={index}
            onClick={onClick}
            sx={{
                border: "1px solid #ECECEC",
                borderRadius: 2,
                mb: 1.5,
                py: 1,
                px: 2,
                display: "flex",
                gap: 2,
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ width: "60px", height: "60px" }}>
                    {membro.nome?.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemAvatar>
            <Box flex={1}>
                <Typography sx={{ fontSize: "16px" }}>{membro.nome}</Typography>
                <Divider sx={{ borderColor: "black" }} />
                <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                    {membro.funcao}
                </Typography>
            </Box>
        </ListItem>
    );
}
