"use client";

import { Container, Box } from "@mui/material";
import { MainWrapper, PageWrapper } from "./styled";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MainWrapper className="mainwrapper">
            <Sidebar />
            <PageWrapper className="page-wrapper">
                <Header />
                <Container sx={{ paddingTop: "20px", maxWidth: "1200px"}}>
                    <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
                        {children}
                    </Box>
                </Container>
            </PageWrapper>
        </MainWrapper>
    );
}
