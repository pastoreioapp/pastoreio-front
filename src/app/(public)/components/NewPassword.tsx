"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Box,
    Typography,
    Button,
    Stack,
    InputAdornment,
    IconButton,
    useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import CustomTextField from "@/ui/components/ui/CustomTextField";

export default function NewPassword() {
    const theme = useTheme();
    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleClickShowPasswordNew = () => {
        setShowPasswordNew(!showPasswordNew);
    };

    const handleClickShowPasswordConfirm = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };

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
                sx={{ color: theme.palette.grey[500], fontSize: "0.875rem", mb: 4 }}
            >
                Seu e-mail foi verificado, vamos criar uma nova senha
            </Typography>

            <Stack gap={0}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="password-new"
                    sx={{ color: theme.palette.grey[600], fontSize: "0.875rem", mb: 0.5 }}
                >
                    Insira uma nova senha <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                <CustomTextField
                    id="password-new"
                    variant="outlined"
                    fullWidth
                    placeholder="Nova senha"
                    required
                    type={showPasswordNew ? "text" : "password"}
                    sx={inputSx}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPasswordNew}
                                    edge="end"
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                    {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="password-confirm"
                    sx={{
                        color: theme.palette.grey[600],
                        fontSize: "0.875rem",
                        mt: 2.5,
                        mb: 0.5,
                        display: "block",
                    }}
                >
                    Confirme sua senha <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                <CustomTextField
                    id="password-confirm"
                    variant="outlined"
                    fullWidth
                    placeholder="Confirme sua senha"
                    required
                    type={showPasswordConfirm ? "text" : "password"}
                    sx={inputSx}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPasswordConfirm}
                                    edge="end"
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/login"
                sx={{
                    borderRadius: "5px",
                    height: "46px",
                    fontWeight: 100,
                    fontSize: "0.9375rem",
                    textTransform: "none",
                    boxShadow: "none",
                    textDecoration: "none",
                    mt: 4,
                    "&:hover": { boxShadow: "none" },
                }}
            >
                Confirmar
            </Button>

            <Box width="100%" textAlign="center" mt={4}>
                <Button
                    startIcon={<ArrowBack />}
                    component={Link}
                    href="/receiveCode"
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
