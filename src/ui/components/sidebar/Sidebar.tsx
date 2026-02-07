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
    IconButton,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";
import { Menuitems, MenuItemType } from "./MenuItems";
import { usePathname } from "next/navigation";

interface SidebarProps {
    mobileOpen: boolean;
    onDrawerToggle: () => void;
}

const StyledListItem = styled(ListItem)(() => ({
    display: "flex",
    justifyContent: "center",
    marginBottom: "8px",
    ".MuiButtonBase-root": {
        width: "240px",
        height: "52px",
        borderRadius: "8px",
        color: "#929EAE",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: "20px",
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
            fontWeight: "500",
            fontFamily: "'Poppins', sans-serif",
            color: "inherit",
        },
        "&:hover": {
            backgroundColor: "rgba(94, 121, 179, 0.08)",
        },
        "&.Mui-selected": {
            color: "#1B212D",
            backgroundColor: "rgba(94, 121, 179, 0.15)",
            "&:hover": {
                backgroundColor: "rgba(94, 121, 179, 0.15)",
            },
            ".MuiListItemIcon-root": {
                color: "#1B212D",
            },
            ".MuiListItemText-primary": {
                fontWeight: "600",
            },
        },
    },
}));

const NavItem = ({
    item,
    pathDirect,
    onNavigate,
}: {
    item: MenuItemType;
    pathDirect: string;
    onNavigate?: () => void;
}) => {
    const Icon = item.icon;
    const itemIcon = <Icon size={"24px"} stroke={2} />;

    return (
        <StyledListItem disablePadding>
            <ListItemButton
                component={Link}
                href={item.href}
                selected={pathDirect === item.href}
                onClick={onNavigate}
            >
                <ListItemIcon>{itemIcon}</ListItemIcon>
                <ListItemText primary={item.title} />
            </ListItemButton>
        </StyledListItem>
    );
};

const SidebarItemsList = ({ onNavigate }: { onNavigate?: () => void }) => {
    const pathDirect = usePathname();
    return (
        <List component="nav" sx={{ pt: "50px" }}>
            {Menuitems.map((item) => (
                <NavItem 
                    key={item.id} 
                    item={item} 
                    pathDirect={pathDirect}
                    onNavigate={onNavigate}
                />
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

export default function SidebarComponent({ mobileOpen, onDrawerToggle }: SidebarProps) {

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#FFFFFF",
                py: "36px",
                px: "19px",
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
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
                <CardBottom />
            </Box>
        </Box>
    );

    const mobileDrawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#FFFFFF",
                py: "24px",
                px: "19px",
                position: "relative",
            }}
        >
            <IconButton
                onClick={onDrawerToggle}
                sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    color: "#4c5059",
                    zIndex: 10,
                    "&:hover": {
                        backgroundColor: "rgba(94, 121, 179, 0.08)",
                    },
                }}
            >
                <IconX size={24} />
            </IconButton>
            <LogoArea />
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <SidebarItemsList onNavigate={onDrawerToggle} />
            </Box>
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
                <CardBottom />
            </Box>
        </Box>
    );

    return (
        <>
            <Box
                sx={{
                    width: { xs: 0, md: "278px" },
                    flexShrink: 0,
                    display: { xs: "none", md: "block" },
                }}
            >
                <Drawer
                    anchor="left"
                    open
                    variant="permanent"
                    sx={{
                        "& .MuiDrawer-paper": {
                            position: "fixed",
                            top: 0,
                            left: 0,
                            margin: { md: "27px 0 27px 50px" },
                            height: "calc(100% - 54px)",
                        },
                    }}
                    PaperProps={{
                        sx: {
                            width: "278px",
                            borderRight: "none",
                            overflowX: "hidden",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "30px",
                            boxShadow: "0px 0px 20px rgba(183, 202, 255, 0.25)",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={onDrawerToggle}
                variant="temporary"
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: "278px",
                        borderRight: "none",
                        overflowX: "hidden",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 0px 20px rgba(183, 202, 255, 0.25)",
                    },
                }}
            >
                {mobileDrawerContent}
            </Drawer>
        </>
    );
}
