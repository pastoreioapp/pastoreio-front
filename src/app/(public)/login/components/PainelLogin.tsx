"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import CustomTextField from "@/ui/components/ui/CustomTextField";
import {
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  ArrowBack,
} from "@mui/icons-material";
import InputMask from "react-input-mask";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { enqueueSnackbar } from "notistack";
import {
  getLoginValidationError,
  isValidEmail,
  isValidPhone,
} from "@/ui/utils/validation";

export type LoginType = "email" | "phone";

type LoginStep = "menu" | "email" | "phone";

export default function PainelLogin() {
    const theme = useTheme();
    const appAuthentication = useAppAuthentication();

    const [step, setStep] = useState<LoginStep>("menu");
    const [showPassword, setShowPassword] = useState(false);
    const [userLogin, setUserLogin] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");
    const [loginTouched, setLoginTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const loginType: LoginType = step === "phone" ? "phone" : "email";

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleBack = () => {
        setStep("menu");
        setUserLogin("");
        setUserPassword("");
        setLoginTouched(false);
        setPasswordTouched(false);
        setShowPassword(false);
    };

    const handleGoogleLoginButtonClick = async () => {
        try {
            await appAuthentication.runGoogleLogin();
        } catch (error: any) {
            enqueueSnackbar("Falha ao realizar login com Google. Tente novamente.", { variant: "error" });
        }
    };

    const isLoginValid = (): boolean => {
        if (!userLogin.trim()) return false;
        return loginType === "email" ? isValidEmail(userLogin.trim()) : isValidPhone(userLogin.trim());
    };

    const loginError = loginTouched ? getLoginValidationError(userLogin, loginType) : null;
    const passwordError = passwordTouched && !userPassword.trim() ? "Senha é obrigatória" : null;

    const handleLoginButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginTouched(true);
        setPasswordTouched(true);

        if (!isLoginValid()) {
            enqueueSnackbar(loginError || "Preencha o campo de login corretamente.", {
                variant: "error",
            });
            return;
        }
        if (userPassword) {
            try {
                await appAuthentication.runPasswordUserLogin({
                    login: userLogin.trim(),
                    password: userPassword,
                    loginType,
                });
            } catch (error: any) {
                if (
                    error.message?.includes("Invalid login credentials") ||
                    error.status === 401
                ) {
                    enqueueSnackbar("Usuário e/ou senha incorreto(s)", { variant: "error" });
                } else {
                    enqueueSnackbar(
                        "Falha ao realizar o login. Tente novamente mais tarde ou contate os administradores",
                        { variant: "error" }
                    );
                }
            }
        } else {
            enqueueSnackbar("Preencha todos os campos obrigatórios.", { variant: "error" });
        }
    };

    const menuButtonSx = {
        borderRadius: "5px",
        height: "46px",
        fontWeight: 100,
        fontSize: "0.9375rem",
        textTransform: "none",
        mt: 2,
        boxShadow: "none",
        "&:hover": {
            boxShadow: "none",
        },
    };

    if (step === "menu") {
        return (
            <>
                <Typography
                    variant="h3"
                    textAlign="center"
                    mb={4}
                    sx={{ color: theme.palette.grey[600], fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: 100 }}
                >
                    Acesse sua conta
                </Typography>

                <Stack>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => setStep("email")}
                        startIcon={<Email />}
                        sx={menuButtonSx}
                    >
                        Entrar com email
                    </Button>

                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => setStep("phone")}
                        startIcon={<Phone />}
                        sx={menuButtonSx}
                    >
                        Entrar com telefone
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleLoginButtonClick}
                        startIcon={
                            <Image
                                src="/images/icons/icon-google.svg"
                                alt="Google"
                                width={20}
                                height={20}
                                unoptimized
                            />
                        }
                        sx={{
                            borderRadius: "5px",
                            height: "46px",
                            mt: 1.5,
                            textTransform: "none",
                            borderColor: theme.palette.grey[50],
                            color: theme.palette.grey[600],
                            fontSize: "0.875rem",
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: theme.palette.primary.light + "20",
                            },
                        }}
                    >
                        Continuar com Google
                    </Button>

                    
                    <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                        mt={5}
                        sx={{ width: "100%", flexWrap: "wrap" }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 400, color: theme.palette.grey[600], fontSize: "0.875rem" }}
                        >
                            Ainda não possui uma conta?
                        </Typography>
                        <Typography
                            variant="body1"
                            component={Link}
                            href="/register"
                            sx={{
                                textDecoration: "none",
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                fontSize: "0.875rem",
                            }}
                        >
                            Cadastre-se
                        </Typography>
                    </Stack>
                </Stack>
            </>
        );
    }

    return (
        <>
            <Typography
                variant="h3"
                textAlign="center"
                mb={4}
                sx={{ color: theme.palette.grey[600], fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: 100 }}
            >
                {loginType === "email" ? "Entrar com email" : "Entrar com telefone"}
            </Typography>

            <Box>
                <form onSubmit={handleLoginButtonClick}>
                    <Stack mb={3} gap={0}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="login"
                            sx={{ color: theme.palette.grey[600], fontSize: "0.875rem", mb: 0.5 }}
                        >
                            {loginType === "email" ? "Email" : "Telefone"}{" "}
                            <span style={{ color: theme.palette.error.main }}>*</span>
                        </Typography>
                        {loginType === "phone" ? (
                            <InputMask
                                mask="99 99999-9999"
                                value={userLogin}
                                onChange={(event) => setUserLogin(event.target.value)}
                                onBlur={() => setLoginTouched(true)}
                            >
                                {(inputProps: any) => (
                                    <CustomTextField
                                        {...inputProps}
                                        required
                                        fullWidth
                                        error={!!loginError}
                                        helperText={loginError}
                                        id="login"
                                        variant="outlined"
                                        type="tel"
                                        placeholder="11 99999-9999"
                                        sx={{
                                            "& .MuiOutlinedInput-input": {
                                                py: 1.25,
                                                fontSize: "0.9375rem",
                                            },
                                        }}
                                    />
                                )}
                            </InputMask>
                        ) : (
                            <CustomTextField
                                required
                                fullWidth
                                error={!!loginError}
                                helperText={loginError}
                                id="login"
                                variant="outlined"
                                type="email"
                                placeholder="Digite seu email"
                                value={userLogin}
                                onChange={(event) => setUserLogin(event.target.value)}
                                onBlur={() => setLoginTouched(true)}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        py: 1.25,
                                        fontSize: "0.9375rem",
                                    },
                                }}
                            />
                        )}

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="password"
                            sx={{
                                color: theme.palette.grey[600],
                                fontSize: "0.875rem",
                                mt: 2.5,
                                mb: 0.5,
                                display: "block",
                            }}
                        >
                            Senha <span style={{ color: theme.palette.error.main }}>*</span>
                        </Typography>

                        <CustomTextField
                            required
                            fullWidth
                            error={!!passwordError}
                            helperText={passwordError}
                            id="password"
                            variant="outlined"
                            placeholder="Digite sua senha"
                            type={showPassword ? "text" : "password"}
                            value={userPassword}
                            onChange={(event) => setUserPassword(event.target.value)}
                            onBlur={() => setPasswordTouched(true)}
                            sx={{
                                "& .MuiOutlinedInput-input": {
                                    py: 1.25,
                                    fontSize: "0.9375rem",
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ color: theme.palette.primary.main }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
                            Esqueceu a Senha?
                        </Typography>
                        <Typography
                            variant="body1"
                            component={Link}
                            href="/recover"
                            sx={{
                                textDecoration: "none",
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                fontSize: "0.875rem",
                            }}
                        >
                            Recuperar
                        </Typography>
                    </Stack>

                    <Button
                        fullWidth
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        sx={{
                            borderRadius: "5px",
                            height: "46px",
                            fontWeight: 100,
                            fontSize: "0.9375rem",
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                                boxShadow: "none",
                            },
                        }}
                    >
                        Entrar
                    </Button>
                </form>
            </Box>

            <Box width="100%" textAlign="center" mt={4}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{
                        textTransform: "none",
                        color: theme.palette.grey[500],
                        fontWeight: 500,
                        fontSize: "0.9375rem",
                        px: 0,
                        "&:hover": {
                            backgroundColor: "transparent",
                            color: theme.palette.primary.main,
                        },
                    }}
                >
                    Voltar para menu inicial
                </Button>
            </Box>
        </>
    );
}
