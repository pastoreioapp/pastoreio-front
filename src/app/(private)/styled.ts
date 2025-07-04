import { styled } from "@mui/material";

export const MainWrapper = styled("div")(() => ({
    display: "flex",
    minHeight: "100vh",
    width: "100%",
}));

export const PageWrapper = styled("div")(() => ({
    display: "flex",
    flexGrow: 1,
    paddingBottom: "60px",
    flexDirection: "column",
    zIndex: 1,
    backgroundColor: "transparent",
}));