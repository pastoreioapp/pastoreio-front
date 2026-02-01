"use client";

import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    styled,
} from "@mui/material";
import Link from "next/link";
import { Menuitems, MenuItemType } from "./MenuItems";
import { usePathname } from "next/navigation";

const StyledListItem = styled(ListItem)(() => ({
    display: "flex",
    justifyContent: "center",
    marginBottom: "2px",
    ".MuiButtonBase-root": {
        width: "240px",
        height: "52px",
        borderRadius: "8px",
        color: "#929ead",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
        ".MuiListItemIcon-root": {
            minWidth: "auto",
            color: "inherit",
            marginRight: "15px",
            display: "flex",
            alignItems: "center",
        },
        ".MuiListItemText-root": {
            opacity: 1,
            whiteSpace: "nowrap",
        },
        ".MuiListItemText-primary": {
            fontSize: "17px",
            fontWeight: "600",
            color: "inherit",
        },
        "&:hover": {
            backgroundColor: "#dce8e6",
        },
        "&.Mui-selected": {
            color: "#1c222e",
            backgroundColor: "#dce8e6",
            "&:hover": {
                backgroundColor: "#dce8e6",
            },
            ".MuiListItemIcon-root": {
                color: "#1c222e",
            },
        },
    },
}));

const NavItem = ({
    item,
    pathDirect,
}: {
    item: MenuItemType;
    pathDirect: string;
}) => {
    const Icon = item.icon;
    const itemIcon = <Icon size={"24px"} stroke={2} />;

    return (
        <StyledListItem disablePadding>
            <ListItemButton
                component={Link}
                href={item.href}
                selected={pathDirect === item.href}
            >
                <ListItemIcon>{itemIcon}</ListItemIcon>
                <ListItemText primary={item.title} />
            </ListItemButton>
        </StyledListItem>
    );
};

const SidebarItemsList = () => {
    const pathDirect = usePathname();
    return (
        <List component="nav" sx={{ pt: "50px" }}>
            {Menuitems.map((item) => (
                <NavItem key={item.id} item={item} pathDirect={pathDirect} />
            ))}
        </List>
    );
};

const LogoArea = () => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
        }}
    >
        <Box
            sx={{
                width: "240px",
                height: "154px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img src="/images/logos/Logo.svg" alt="Logo" />
        </Box>
    </Box>
);

const CardBottom = () => (
    <Box
        sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img
                src="/images/cards/versiculo.svg"
                alt="Card"
                style={{ width: "240px", height: "132.05px" }}
            />
        </Box>
    </Box>
);

export default function SidebarComponent() {
    return (
        <Box
            sx={{
                width: "300px",
                flexShrink: 0,
                transition: "width 0.3s ease",
            }}
        >
            <Drawer
                anchor="left"
                open
                variant="permanent"
                PaperProps={{
                    sx: {
                        width: "300px",
                        borderRight: "none",
                        overflowX: "hidden",
                        backgroundColor: "#fafafa",
                    },
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#fafafa",
                        py: "36px",
                        px: "30px",
                    }}
                >
                    <LogoArea />
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}
                    >
                        <SidebarItemsList />
                    </Box>
                    <Box sx={{ mt: "auto" }}>
                        <CardBottom />
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
}
