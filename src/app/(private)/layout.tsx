"use client";
import { Box } from "@mui/material";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import { useRouter } from "next/navigation";
import { useAppAuthentication } from "@/features/auth/auth.service";

export default function RootLayout({children}: { children: React.ReactNode; }) {
    const router = useRouter();
    const appAuth = useAppAuthentication();

    if(!appAuth.userIsAuthenticated()) {
        router.push('/login');
        return;
    }

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <Header />
                <Box>{children}</Box>
            </Box>
        </Box>
    );
}
