"use client";

import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Switch,
  Badge,
  Button,
} from "@mui/material";
import {
  IconBrightnessUp,
  IconSettings,
  IconUser,
  IconArrowLeft,
  IconHeadphones,
  IconCaretDownFilled,
  IconLogout2,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearLoggedUser } from "@/store/features/loggedUserSlice";

const onlineBadgeStyle = {
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: "0 0 0 2px #fff",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
};

interface ProfileProps {
  onMenuItemClick?: (item: string) => void;
}

export default function Profile({ onMenuItemClick }: ProfileProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const loggedUser = useSelector<RootState>(state => state.loggedUser);
  console.log("Logged User:", loggedUser);

  function handleLogoutButtonClick(): void {
      dispatch(clearLoggedUser());
      router.push("/auth/login");
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item: string) => {
    if (item === "Sair") {
      handleLogoutButtonClick();
    }

    if (item !== "Tema") {
      setActiveItem(item);
      if (onMenuItemClick) {
        onMenuItemClick(item);
      }
    }
    handleClose();
  };

  const isOpen = Boolean(anchorEl);

  const menuItemStyles = {
    py: "8px",
    borderRadius: "6px",
    "&.Mui-selected, &:hover": {
      backgroundColor: "#e1e6f0",
      "& .MuiListItemIcon-root, & .MuiTypography-root": {
        color: "#0d3b8a",
        fontWeight: 500,
      },
    },
    "& .MuiListItemIcon-root": {
      minWidth: "40px",
      color: "#484759",
    },
    "& .MuiTypography-root": {
      color: "#484759",
      fontWeight: 500,
    },
  };

  return (
    <Box>
      <Button
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textTransform: "none",
          padding: "6px 12px 6px 6px",
          borderRadius: "50px",
          marginLeft: "20px",
          backgroundColor: "#f1f1f1",
          color: "#374151",
          "&:hover": {
            backgroundColor: "#e5e7eb",
          },
        }}
      >
        <Avatar
          sx={{
            width: 35,
            height: 35,
            bgcolor: "#0d3b8a",
            fontSize: "14px",
            fontWeight: "600",
            color: "#fff",
          }}
        >
          SO
        </Avatar>
        <Typography variant="body1" fontWeight="600" sx={{ mx: 1.5 }}>
          Samuel Oliveira
        </Typography>
        <IconCaretDownFilled
          size="18"
          style={{
            transition: "transform 0.2s ease-in-out",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Button>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "250px",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "8px",
          },
        }}
      >
        <Box
          sx={{ padding: "12px 8px", display: "flex", alignItems: "center" }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={onlineBadgeStyle}
          >
            <Avatar
              sx={{
                bgcolor: "#0d3b8a",
                width: 48,
                height: 48,
                fontSize: "16px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              SO
            </Avatar>
          </Badge>
          <Box ml={2}>
            <Typography variant="h6" component="h2" fontWeight="600">
              Samuel Oliveira
            </Typography>
            <Typography variant="body2" color="#6b7280">
              samuel@gmail.com
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          selected={activeItem === "Perfil"}
          onClick={() => handleItemClick("Perfil")}
          sx={menuItemStyles}
        >
          <ListItemIcon>
            <IconUser size={20} />
          </ListItemIcon>
          <ListItemText primary="Perfil" />
        </MenuItem>

        <MenuItem
          selected={activeItem === "Ajustes"}
          onClick={() => handleItemClick("Ajustes")}
          sx={menuItemStyles}
        >
          <ListItemIcon>
            <IconSettings size={20} />
          </ListItemIcon>
          <ListItemText primary="Ajustes" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          sx={{
            ...menuItemStyles,
            justifyContent: "space-between",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <ListItemIcon>
              <IconBrightnessUp size={20} />
            </ListItemIcon>
            <ListItemText primary="Tema" />
          </Box>
          <Switch defaultChecked onClick={(e) => e.stopPropagation()} />
        </MenuItem>

        <MenuItem
          selected={activeItem === "Suporte"}
          onClick={() => handleItemClick("Suporte")}
          sx={menuItemStyles}
        >
          <ListItemIcon>
            <IconHeadphones size={20} />
          </ListItemIcon>
          <ListItemText primary="Suporte" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={() => handleItemClick("Sair")}
          sx={{
            display: "flex",
            justifyContent: "center",
            py: "8px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "#e1e6f0",
              "& .MuiListItemIcon-root, & .MuiTypography-root": {
                color: "#0d3b8a",
                fontWeight: 600,
              },
            },
            "& .MuiListItemIcon-root": {
              justifyContent: "center",
              minWidth: "auto",
              paddingRight: "8px",
              color: "#0d3b8a",
            },
            "& .MuiListItemText-root": {
              flex: "none",
            },
            "& .MuiTypography-root": {
              color: "#0d3b8a",
              fontWeight: 600,
            },
          }}
        >
          <ListItemIcon>
            <IconLogout2 size={20} />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </Menu>
    </Box>
  );
}
