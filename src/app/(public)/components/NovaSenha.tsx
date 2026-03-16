"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Box,
    Typography,
    Button,
    Stack,
    InputAdornment,
    IconButton,
    useTheme,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import CustomTextField from "@/ui/components/ui/CustomTextField";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { getPasswordValidationError } from "@/ui/utils/validation";
import { enqueueSnackbar } from "notistack";
import { createClient } from "@/shared/supabase/client";

type PageState = "loading" | "form" | "success" | "no-session";

export default function NovaSenha() {
    const theme = useTheme();
    const router = useRouter();
    const { runUpdatePassword } = useAppAuthentication();

    const [pageState, setPageState] = useState<PageState>("loading");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [newPasswordTouched, setNewPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setPageState(user ? "form" : "no-session");
        });
    }, []);

    const newPasswordError = newPasswordTouched
        ? getPasswordValidationError(newPassword)
        : null;

    const confirmPasswordError =
        confirmPasswordTouched && !confirmPassword
            ? "Campo obrigatório"
            : confirmPasswordTouched && confirmPassword !== newPassword
              ? "As senhas não coincidem"
              : null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNewPasswordTouched(true);
        setConfirmPasswordTouched(true);

        const pwError = getPasswordValidationError(newPassword);
        if (pwError || confirmPassword !== newPassword) return;

        setSubmitting(true);
        try {
            await runUpdatePassword(newPassword);
            setPageState("success");
            enqueueSnackbar("Senha atualizada com sucesso!", {
                variant: "success",
                autoHideDuration: 3000,
            });
        } catch {
            enqueueSnackbar(
                "Não foi possível atualizar a senha. Tente novamente.",
                { variant: "error", autoHideDuration: 4000 }
            );
        } finally {
            setSubmitting(false);
        }
    };

    const inputSx = {
        "& .MuiOutlinedInput-input": {
            py: 1.25,
            fontSize: "0.9375rem",
        },
    };

    if (pageState === "loading") {
        return (
            <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (pageState === "no-session") {
        return (
            <>
                <Typography
                    variant="h3"
                    textAlign="center"
                    mb={1}
                    sx={{ color: theme.palette.grey[600], fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: 100 }}
                >
                    Link inválido ou expirado
                </Typography>

                <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ color: theme.palette.grey[500], fontSize: "0.875rem", mb: 4 }}
                >
                    Solicite um novo link de recuperação de senha.
                </Typography>

                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    component={Link}
                    href="/esqueci-senha"
                    sx={{
                        borderRadius: "5px",
                        height: "46px",
                        fontWeight: 100,
                        fontSize: "0.9375rem",
                        textTransform: "none",
                        boxShadow: "none",
                        textDecoration: "none",
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    Solicitar novo link
                </Button>
            </>
        );
    }

    if (pageState === "success") {
        return (
            <>
                <Typography
                    variant="h3"
                    textAlign="center"
                    mb={1}
                    sx={{ color: theme.palette.grey[600], fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: 100 }}
                >
                    Senha atualizada
                </Typography>

                <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ color: theme.palette.grey[500], fontSize: "0.875rem", mb: 4 }}
                >
                    Sua senha foi redefinida com sucesso. Faça login com a nova senha.
                </Typography>

                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => router.push("/login")}
                    sx={{
                        borderRadius: "5px",
                        height: "46px",
                        fontWeight: 100,
                        fontSize: "0.9375rem",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    Ir para o login
                </Button>
            </>
        );
    }

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

            <form onSubmit={handleSubmit}>
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onBlur={() => setNewPasswordTouched(true)}
                        error={!!newPasswordError}
                        helperText={newPasswordError}
                        disabled={submitting}
                        sx={inputSx}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPasswordNew(!showPasswordNew)}
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setConfirmPasswordTouched(true)}
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        disabled={submitting}
                        sx={inputSx}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
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
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitting}
                    sx={{
                        borderRadius: "5px",
                        height: "46px",
                        fontWeight: 100,
                        fontSize: "0.9375rem",
                        textTransform: "none",
                        boxShadow: "none",
                        mt: 4,
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : "Confirmar"}
                </Button>
            </form>

            <Box width="100%" textAlign="center" mt={4}>
                <Button
                    startIcon={<ArrowBack />}
                    component={Link}
                    href="/esqueci-senha"
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
                    Solicitar novo link
                </Button>
            </Box>
        </>
    );
}
