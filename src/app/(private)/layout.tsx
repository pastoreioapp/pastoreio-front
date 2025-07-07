import { Container, Box } from "@mui/material";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
                <Header />
                <Box>{children}</Box>
            </Box>
        </Box>
    );
}