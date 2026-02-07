"use client";

import Link from "next/link";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import CustomTextField from "@/ui/components/ui/CustomTextField";

export default function ReceiveCode() {
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
                Verificar e-mail
            </Typography>

            <Typography
                variant="body1"
                textAlign="center"
                sx={{ color: theme.palette.grey[500], fontSize: "0.7rem", mb: 4 }}
            >
                Enviamos um código para seu e-mail
            </Typography>

            <Stack mb={1}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="code"
                    sx={{ color: theme.palette.grey[600], fontSize: "0.875rem", mb: 0.5 }}
                >
                    Informe o código recebido:
                </Typography>
                <CustomTextField
                    id="code"
                    variant="outlined"
                    fullWidth
                    placeholder="Código"
                    required
                    sx={inputSx}
                />
            </Stack>

            <Stack
                direction="row"
                justifyContent="center"
                spacing={1}
                sx={{ mt: 1, mb: 3 }}
            >
                <Typography
                    variant="body1"
                    sx={{ fontWeight: 400, color: theme.palette.grey[600], fontSize: "0.875rem" }}
                >
                    Não recebeu o código?
                </Typography>
                <Typography
                    variant="body1"
                    component={Link}
                    href="/receiveCode"
                    sx={{
                        textDecoration: "none",
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: "0.875rem",
                    }}
                >
                    Reenviar 30s
                </Typography>
            </Stack>

            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/newPassword"
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
                Confirmar
            </Button>

            <Box width="100%" textAlign="center" mt={4}>
                <Button
                    startIcon={<ArrowBack />}
                    component={Link}
                    href="/recover"
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
                    Voltar
                </Button>
            </Box>
        </>
    );
}
