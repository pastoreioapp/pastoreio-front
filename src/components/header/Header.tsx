"use client";

import {
    Box,
    AppBar,
    Toolbar,
    Stack,
    IconButton,
    Typography,
} from "@mui/material";
import Profile from "./Profile";
import { IconBellRingingFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Menuitems } from "../sidebar/MenuItems";

export default function Header() {
    const pathname = usePathname();
    const currentItem = Menuitems.find((item) => item.href === pathname);
    const pageTitle = currentItem ? currentItem.title : "Central da Célula";

    return (
        <AppBar
            position="sticky"
            sx={{
                boxShadow: "none",
                background: "#fff",
                backdropFilter: "blur(4px)",
                paddingTop: "36px",
                paddingBottom: "24px",
                margin: 0,
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    width: "100%",
                    minHeight: "unset",
                    color: "#929ead",
                    display: "flex",
                    justifyContent: "space-between",
                    px: "50px",
                }}
            >
                <Box>
                    <Typography variant="h3" fontWeight={600} color="#000">
                        {pageTitle}
                    </Typography>
                </Box>
                <Stack direction="row" alignItems="center">
                    <IconButton
                        size="small"
                        aria-label="notificações"
                        color="inherit"
                        sx={{ marginLeft: "100px", padding: "10px" }}
                    >
                        <IconBellRingingFilled size={28} stroke="1.5" />
                    </IconButton>
                    <Profile />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
