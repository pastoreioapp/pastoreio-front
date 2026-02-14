"use client";

import Link from "next/link";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import CustomTextField from "@/ui/components/ui/CustomTextField";

export default function RecoverPassword() {
    const theme = useTheme();

    const inputSx = {
        "& .MuiOutlinedInput-input": {
            py: 1.25,
            fontSize: "0.9375rem",
        },
    };

    return (
        <>
            <Typography
                variant="h3"
                textAlign="center"
                mb={1}
                sx={{ color: theme.palette.grey[600], fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: 100 }}
            >
                Recuperar senha
            </Typography>

            <Typography
                variant="body1"
                textAlign="center"
                sx={{ color: theme.palette.grey[500], fontSize: "0.7rem", mb: 4 }}
            >
                Problemas para entrar? Recupere sua senha!
            </Typography>

            <Stack mb={3}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="email"
                    sx={{ color: theme.palette.grey[600], fontSize: "0.875rem", mb: 0.5 }}
                >
                    Endereço de E-mail <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                <CustomTextField
                    id="email"
                    variant="outlined"
                    fullWidth
                    placeholder="Digite seu endereço de e-mail"
                    required
                    sx={inputSx}
                />
            </Stack>

            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/receiveCode"
                sx={{
                    borderRadius: "5px",
                    height: "46px",
                    fontWeight: 100,
                    fontSize: "0.9375rem",
                    textTransform: "none",
                    boxShadow: "none",
                    textDecoration: "none",
                    mt: 2,
                    "&:hover": { boxShadow: "none" },
                }}
            >
                Recuperar senha
            </Button>

            <Box width="100%" textAlign="center" mt={4}>
                <Button
                    startIcon={<ArrowBack />}
                    component={Link}
                    href="/login"
                    sx={{
                        textTransform: "none",
                        color: theme.palette.grey[500],
                        fontWeight: 500,
                        fontSize: "0.9375rem",
                        px: 0,
                        textDecoration: "none",
                        "&:hover": {
                            backgroundColor: "transparent",
                            color: theme.palette.primary.main,
                        },
                    }}
                >
                    Voltar para o login
                </Button>
            </Box>
        </>
    );
}
