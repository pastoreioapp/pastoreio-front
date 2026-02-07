"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

export default function NotFound() {
    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background:
                    "linear-gradient(180deg, #FFFFFF 50%, #DCE9F9 100%)",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: { xs: 20, md: 60 },
                    top: { xs: 20, md: 40 },
                }}
            >
                <Image
                    src="/images/logos/logo-horizontal.svg"
                    alt="Pastoreio"
                    width={180}
                    height={45}
                    style={{ width: "auto", height: "auto" }}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 4, md: 2 },
                    padding: 4,
                    maxWidth: "1100px",
                    width: "100%",
                }}
            >
                <Box sx={{ flexShrink: 0, display: { xs: "none", md: "block" } }}>
                    <Image
                        src="/images/not-found/ovelha.svg"
                        alt="Ovelha triste"
                        width={420}
                        height={450}
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        maxWidth: "650px",
                    }}
                >
                    <Box sx={{marginLeft: "30px"}}>
                        <Image
                            src="/images/not-found/numero.svg"
                            alt="404"
                            width={650}
                            height={180}
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            color: "#173D8A",
                            fontWeight: 900,
                            fontSize: { xs: "28px", md: "30px" },
                            marginBottom: 2,
                            marginTop: 2,
                        }}
                    >
                        Página não encontrada
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "#1B212D",
                            fontSize: { xs: "16px", md: "18px" },
                            marginBottom: 4,
                            lineHeight: 1.5,
                        }}
                    >
                        Desculpe, a página que você está procurando não existe
                        ou
                        <br />
                        foi movida. Volte para a página inicial.
                    </Typography>

                    <Button
                        variant="contained"
                        href="/dashboard"
                        sx={{
                            backgroundColor: "#214487",
                            color: "#fff",
                            padding: "14px 72px",
                            borderRadius: "50px",
                            textTransform: "none",
                            fontSize: "16px",
                            boxShadow: "0px 4px 14px rgba(23, 61, 138, 0.3)",
                            "&:hover": {
                                backgroundColor: "#102a5e",
                            },
                        }}
                    >
                        Voltar ao início
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
