import type { SxProps, Theme } from "@mui/material";

export const BRAND = "#5E79B3";
export const BRAND_HOVER = "#4A6499";
export const BRAND_LIGHT = "#7B95CC";

export const SUCCESS = "#4A845D";
export const WARNING = "#D4831F";
export const DANGER = "#A83836";

export const FOCUS_OUTLINE: SxProps<Theme> = {
    "&:focus-visible": {
        outline: `2px solid ${BRAND}`,
        outlineOffset: "2px",
    },
};

export const CARD_STYLE: SxProps<Theme> = {
    bgcolor: "#fff",
    border: "1px solid rgba(176, 177, 188, 0.25)",
    borderRadius: 3,
    p: { xs: 2.5, md: 3.5 },
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
};
