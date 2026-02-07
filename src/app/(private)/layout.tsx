"use client";
import { Box } from "@mui/material";
import Sidebar from "@/ui/components/sidebar/Sidebar";
import Header from "@/ui/components/header/Header";
import { useState } from "react";

export default function RootLayout({children}: { children: React.ReactNode; }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box 
            sx={{ 
                display: "flex", 
                backgroundColor: "#F4F7FF",
                padding: { xs: "15px", sm: "20px", md: "27px 50px" },
                gap: "27px",
            }}
        >
            <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    width: "100%",
                    gap: "27px",
                }}
            >
                <Header onMenuClick={handleDrawerToggle} />
                <Box 
                    sx={{ 
                        flex: 1,
                        backgroundColor: "#FFFFFF",
                        borderRadius: "30px",
                        boxShadow: "0px 0px 20px rgba(183, 202, 255, 0.25)",
                        padding: { xs: "20px", sm: "30px", md: "40px" },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
