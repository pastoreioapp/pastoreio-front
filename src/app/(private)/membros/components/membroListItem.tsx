import { Membro } from "@/features/membros/types";
import {
    Avatar,
    Box,
    Divider,
    ListItem,
    ListItemAvatar,
    Typography,
} from "@mui/material";

export function MembroListItem({
    membro,
    selected,
    onClick,
}: {
    membro: Membro;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <ListItem
            onClick={onClick}
            sx={{
                border: "1px solid #ECECEC",
                bgcolor: selected ? "#DCE8E7" : "#fff",
                borderRadius: "7px",
                marginBottom: "15px",
                paddingY: "15px",
                paddingX: "15.32px",
                display: "flex",
                gap: "17px",
                width: "330px",
                height: "90px",
                transition: "background-color 0.2s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: "#DCE8E7",
                },
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ width: 60, height: 60 }}>
                    {membro.nome?.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemAvatar>
            <Box flex={1}>
                <Typography fontSize={16}>{membro.nome}</Typography>
                <Divider
                    sx={{ borderColor: "#1B212D", mt: "2px", mb: "4px" }}
                />
                <Typography fontSize={12} fontWeight={600}>
                    {membro.funcao}
                </Typography>
            </Box>
        </ListItem>
    );
}
