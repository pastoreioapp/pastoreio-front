"use client";

import {
    Box,
    AppBar,
    Toolbar,
    Stack,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Profile from "./Profile";
import { IconMenu2 } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Menuitems } from "../sidebar/MenuItems";
import { poppins } from "@/ui/utils/theme";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname();
    const currentItem = Menuitems.find((item) => item.href === pathname);
    const pageTitle = currentItem ? currentItem.title : "Central da Célula";
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <AppBar
            position="sticky"
            sx={{
                boxShadow: "0px 0px 20px rgba(183, 202, 255, 0.25)",
                background: "#FFFFFF",
                backdropFilter: "blur(4px)",
                borderRadius: "30px",
                padding: { xs: "10px 10px", sm: "12px 15px", md: "18px 25px" },
                margin: 0,
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    width: "100%",
                    minHeight: "unset",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 0,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
                    {isMobile && (
                        <IconButton
                            onClick={onMenuClick}
                            sx={{
                                padding: { xs: "6px", sm: "8px" },
                                color: "#1B212D",
                                "&:hover": {
                                    backgroundColor: "rgba(94, 121, 179, 0.08)",
                                },
                            }}
                        >
                            <IconMenu2 size={20} />
                        </IconButton>
                    )}
                    <Box
                        component="span"
                        sx={{
                            width: { xs: "32px", sm: "36px", md: "40px" },
                            height: { xs: "32px", sm: "36px", md: "40px" },
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: { xs: "4px", sm: "6px", md: "8px" },
                            color: "#1B212D",
                        }}
                    >
                        {currentItem && <currentItem.icon size={isMobile ? 20 : 24} stroke={2} />}
                    </Box>
                    <Typography 
                        variant="h3" 
                        fontWeight={600} 
                        color="#1B212D"
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                            fontFamily: poppins.style.fontFamily,
                        }}
                    >
                        {pageTitle}
                    </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1, md: 2 }}>
                    {/* TODO: Desabilitado pois ainda não temos notificações */}
                    {/* <IconButton
                        size="medium"
                        aria-label="notificações"
                        sx={{ 
                            padding: { xs: "6px", sm: "8px", md: "10px" },
                            marginRight: { xs: "5px", sm: "10px", md: "15px" },
                            color: "#929EAE",
                            "&:hover": {
                                backgroundColor: "rgba(94, 121, 179, 0.08)",
                            },
                        }}
                    >
                        <Badge
                            badgeContent={3}
                            sx={{
                                "& .MuiBadge-badge": {
                                    backgroundColor: "#FF5353",
                                    color: "#FFFFFF",
                                    fontSize: { xs: "9px", sm: "10px" },
                                    fontWeight: "600",
                                    minWidth: { xs: "16px", sm: "18px" },
                                    height: { xs: "16px", sm: "18px" },
                                    borderRadius: "50%",
                                },
                            }}
                        >
                            <IconBellRingingFilled size={isMobile ? 20 : 24} stroke="1.5" />
                        </Badge>
                    </IconButton> */}
                    <Profile />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
