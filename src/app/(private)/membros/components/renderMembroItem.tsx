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
                bgcolor: "#fff",
                borderRadius: "7px",
                marginBottom: "15px",
                paddingY: "15px",
                paddingX: "15.32px",
                display: "flex",
                gap: "17px",
                width: "330px",
                height: "90px",
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ width: "60px", height: "60px" }}>
                    {membro.nome?.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemAvatar>
            <Box flex={1}>
                <Typography sx={{ fontSize: "16px" }}>{membro.nome}</Typography>
                <Divider
                    sx={{
                        borderColor: "#1B212D",
                        marginTop: "2.05px",
                        marginBottom: "4.09px",
                    }}
                />
                <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                    {membro.funcao}
                </Typography>
            </Box>
        </ListItem>
    );
}
