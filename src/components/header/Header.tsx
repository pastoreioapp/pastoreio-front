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
            sx={{
                position: "sticky",
                boxShadow: "none",
                background: "#fff",
                backdropFilter: "blur(4px)",
                paddingTop: "36px",
                paddingRight: "50px",
                paddingLeft: "50px",
            }}
        >
            <Toolbar
                sx={{
                    width: "100%",
                    display: "flex",
                    color: "#929ead",
                    justifyContent: "space-between",
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
