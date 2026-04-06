import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import { getFuncaoCores, getFuncaoLabel } from "../../lib/getFuncaoLabel";
import {
    Avatar,
    Box,
    ListItemAvatar,
    ListItemButton,
    Typography,
} from "@mui/material";

export function MembroListItem({
    membro,
    selected,
    onClick,
}: {
    membro: MembroDaCelulaListItemDto;
    selected: boolean;
    onClick: () => void;
}) {
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
                gap: "17px",
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
            <ListItemAvatar>
                <Avatar
                    src={membro.avatarUrl || undefined}
                    sx={{ width: 60, height: 60, bgcolor: "#5E79B3", color: "#fff" }}
                >
                    {membro.nome ? membro.nome.charAt(0).toUpperCase() : "?"}
                </Avatar>
            </ListItemAvatar>
            <Box flex={1}>
                <Typography fontSize={16}>{membro.nome?.split(" ").slice(0, 2).join(" ")}</Typography>
                <Box
                    sx={{
                        ...getFuncaoCores(membro.funcao),
                        mt: 1,
                        py: 0.3,
                        px: 1,
                        borderRadius: 1,
                        width: "fit-content",
                    }}
                >
                    <Typography sx={{ fontSize: ".7rem", fontWeight: "600" }}>
                        {getFuncaoLabel(membro.funcao)}
                    </Typography>
                </Box>
            </Box>
        </ListItemButton>
    );
}
