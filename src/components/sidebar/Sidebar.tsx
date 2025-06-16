"use client";

import {
  useMediaQuery,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  styled,
  useTheme,
  Theme,
} from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Sidebar as ReactMuiSidebar } from "react-mui-sidebar";
import { Menuitems, MenuItemType } from "./MenuItems";
import { usePathname } from "next/navigation";
import React from "react";

const SIDEBAR_OPEN_WIDTH = "280px";
const SIDEBAR_COLLAPSED_WIDTH = "80px";
const ACTIVE_ITEM_BACKGROUND_COLOR = "#dce8e6";
const ACTIVE_ITEM_TEXT_ICON_COLOR = "#1c222e";
const INACTIVE_ITEM_TEXT_ICON_COLOR = "#929ead";

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isSidebarOpen",
})<{ isSidebarOpen?: boolean }>(({ theme, isSidebarOpen }) => ({
  padding: theme.spacing(0.5, isSidebarOpen ? 3.5 : 1.25),
  display: "flex",
  justifyContent: "center",
  ".MuiButtonBase-root": {
    width: "100%",
    minHeight: "44px",
    padding: theme.spacing(1.1, isSidebarOpen ? 1.5 : 1),
    borderRadius: "8px",
    color: INACTIVE_ITEM_TEXT_ICON_COLOR,
    justifyContent: isSidebarOpen ? "flex-start" : "center",
    alignItems: "center",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    ".MuiListItemIcon-root": {
      minWidth: "auto",
      color: "inherit",
      marginRight: isSidebarOpen ? theme.spacing(1.5) : 0,
      display: "flex",
      alignItems: "center",
    },
    ".MuiListItemText-root": {
      opacity: isSidebarOpen ? 1 : 0,
      transition: "opacity 0.2s ease-in-out",
      whiteSpace: "nowrap",
    },
    ".MuiListItemText-primary": {
      fontSize: "0.9rem",
      fontWeight: 900,
      color: "inherit",
    },
    "&:hover": {
      backgroundColor: ACTIVE_ITEM_BACKGROUND_COLOR,
    },
    "&.Mui-selected": {
      color: ACTIVE_ITEM_TEXT_ICON_COLOR,
      backgroundColor: ACTIVE_ITEM_BACKGROUND_COLOR,
      "&:hover": {
        backgroundColor: ACTIVE_ITEM_BACKGROUND_COLOR,
      },
      ".MuiListItemIcon-root": {
        color: ACTIVE_ITEM_TEXT_ICON_COLOR,
      },
    },
  },
}));

const NavItem = ({
  item,
  isSidebarOpen,
  pathDirect,
}: {
  item: MenuItemType;
  isSidebarOpen: boolean;
  pathDirect: string;
}) => {
  const Icon = item.icon;
  const itemIcon = <Icon size={"1.5rem"} stroke={1.5} />;

  return (
    <StyledListItem isSidebarOpen={isSidebarOpen} disablePadding>
      <ListItemButton
        component={Link}
        href={item.href}
        selected={pathDirect === item.href}
      >
        <ListItemIcon>{itemIcon}</ListItemIcon>
        {isSidebarOpen && <ListItemText primary={item.title} />}
      </ListItemButton>
    </StyledListItem>
  );
};

const SidebarItemsList = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const pathDirect = usePathname();
  return (
    <List component="nav" sx={{ p: 0, pt: 1, pb: 1 }}>
      {Menuitems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isSidebarOpen={isSidebarOpen}
          pathDirect={pathDirect}
        />
      ))}
    </List>
  );
};

const LogoArea = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: isSidebarOpen ? "flex-start" : "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 5,
        mb: 4,
      }}
    >
      <img
        src={
          isSidebarOpen ? "/images/logos/Logo.svg" : "/images/logos/Logo2.svg"
        }
        alt="Logo"
        style={{ width: "55%" }}
      />
    </Box>
  </Box>
);

const CardBottom = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
  <Box
    sx={{
      width: "100%",
      height: "auto",
      display: isSidebarOpen ? "flex" : "none",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: "35px",
    }}
  >
    <Box
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/images/cards/versiculo.svg"
        alt="Card"
        style={{ width: "80%" }}
      />
    </Box>
  </Box>
);

export default function SidebarComponent() {
  const theme = useTheme();
  const lgUp = useMediaQuery((muiTheme: Theme) =>
    muiTheme.breakpoints.up("lg")
  );
  const isSidebarOpen = useSelector(
    (state: RootState) => state.sidebar.isSidebarOpen
  );
  const isMobileSidebarOpen = useSelector(
    (state: RootState) => state.sidebar.isMobileSidebarOpen
  );
  const currentSidebarWidth = isSidebarOpen
    ? SIDEBAR_OPEN_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;

  const sidebarContentStructure = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fafafa",
      }}
    >
      <LogoArea isSidebarOpen={isSidebarOpen} />
      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        <SidebarItemsList isSidebarOpen={isSidebarOpen} />
      </Box>
      <CardBottom isSidebarOpen={isSidebarOpen} />
    </Box>
  );

  const drawerPaperStyles = {
    width: currentSidebarWidth,
    borderRight: "none",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    backgroundColor: "#fafafa",
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          width: currentSidebarWidth,
          flexShrink: 0,
          transition: "width 0.3s ease",
        }}
      >
        <Drawer
          anchor="left"
          open
          variant="permanent"
          PaperProps={{ sx: drawerPaperStyles }}
        >
          {sidebarContentStructure}
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={() => {}}
      variant="temporary"
      PaperProps={{
        sx: {
          ...drawerPaperStyles,
          width: isSidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        },
      }}
      ModalProps={{ keepMounted: true }}
      sx={{ zIndex: theme.zIndex.drawer + 100 }}
    >
      {sidebarContentStructure}
    </Drawer>
  );
}
