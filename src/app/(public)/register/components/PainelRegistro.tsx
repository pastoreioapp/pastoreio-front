"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Button,
    IconButton,
    InputAdornment,
    useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Visibility, VisibilityOff, Email, Phone, ArrowBack } from "@mui/icons-material";
import InputMask from "react-input-mask";
import CustomTextField from "@/ui/components/ui/CustomTextField";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { enqueueSnackbar } from "notistack";
import {
    getLoginValidationError,
    getPasswordValidationError,
    formatPhoneToE164,
    isValidEmail,
    isValidPhone,
} from "@/ui/utils/validation";

export type RegisterLoginType = "email" | "phone";

type RegisterStep = "menu" | "email" | "phone";

export default function PainelRegistro() {
    const theme = useTheme();
    const appAuthentication = useAppAuthentication();

    const [step, setStep] = useState<RegisterStep>("menu");
    const [userLogin, setUserLogin] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginTouched, setLoginTouched] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const loginType: RegisterLoginType = step === "phone" ? "phone" : "email";

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleBack = () => {
        setStep("menu");
        setUserLogin("");
        setUserName("");
        setUserPassword("");
        setLoginTouched(false);
        setNameTouched(false);
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

    const getLoginValueForApi = (): string => {
        if (loginType === "phone" && userLogin.trim()) {
            return formatPhoneToE164(userLogin.trim());
        }
        return userLogin.trim();
    };

    const isLoginValid = (): boolean => {
        if (!userLogin.trim()) return false;
        return loginType === "email" ? isValidEmail(userLogin.trim()) : isValidPhone(userLogin.trim());
    };

    const loginError = loginTouched ? getLoginValidationError(userLogin, loginType) : null;
    const nameError = nameTouched && !userName.trim() ? "Campo obrigatório" : null;
    const passwordError = passwordTouched ? getPasswordValidationError(userPassword) : null;

    const handleRegistrarButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginTouched(true);
        setNameTouched(true);
        setPasswordTouched(true);

        if (!isLoginValid()) {
            enqueueSnackbar(loginError || "Preencha o campo de login corretamente.", { variant: "error" });
            return;
        }
        if (passwordError) {
            enqueueSnackbar(passwordError, { variant: "error" });
            return;
        }
        if (nameError) {
            enqueueSnackbar(nameError, { variant: "error" });
            return;
        }
        if (userName.trim() && userPassword) {
            try {
                const loginValue = getLoginValueForApi();
                await appAuthentication.runUserRegister(loginValue, userPassword, userName.trim(), loginType);
            } catch (error: any) {
                const errorMessage = error.message || "Falha ao registrar conta. Tente novamente mais tarde ou contate os administradores";
                enqueueSnackbar(errorMessage, { variant: "error" });
            }
        } else {
            enqueueSnackbar("Preencha todos os campos obrigatórios.", { variant: "error" });
        }
    };

    const inputSx = {
        "& .MuiOutlinedInput-input": {
            py: 1.25,
            fontSize: "0.9375rem",
        },
    };

    const menuButtonSx = {
        borderRadius: "5px",
        height: "46px",
        fontWeight: 100,
        fontSize: "0.9375rem",
        textTransform: "none" as const,
        mt: 2,
        boxShadow: "none",
        "&:hover": {
            boxShadow: "none",
        },
    };

    /* ─── STEP: MENU ─── */
    if (step === "menu") {
        return (
            <>
                <Typography
                    variant="h3"
                    textAlign="center"
                    mb={4}
                    sx={{ color: theme.palette.grey[600], fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: 100 }}
                >
                    Cadastrar conta
                </Typography>

                <Stack>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => setStep("email")}
                        startIcon={<Email />}
                        sx={menuButtonSx}
                    >
                        Registrar com email
                    </Button>

                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => setStep("phone")}
                        startIcon={<Phone />}
                        sx={menuButtonSx}
                    >
                        Registrar com telefone
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
                            Já tem uma conta?
                        </Typography>
                        <Typography
                            variant="body1"
                            component={Link}
                            href="/login"
                            sx={{
                                textDecoration: "none",
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                fontSize: "0.875rem",
                            }}
                        >
                            Login
                        </Typography>
                    </Stack>
                </Stack>
            </>
        );
    }

    /* ─── STEP: FORMULÁRIO ─── */
    return (
        <>
            <Typography
                variant="h3"
                textAlign="center"
                mb={4}
                sx={{ color: theme.palette.grey[600], fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: 100 }}
            >
                {loginType === "email" ? "Registrar com email" : "Registrar com telefone"}
            </Typography>

            <form onSubmit={handleRegistrarButtonClick}>
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
                                    sx={inputSx}
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
                            sx={inputSx}
                        />
                    )}

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="name"
                        sx={{
                            color: theme.palette.grey[600],
                            fontSize: "0.875rem",
                            mt: 2.5,
                            mb: 0.5,
                            display: "block",
                        }}
                    >
                        Nome completo <span style={{ color: theme.palette.error.main }}>*</span>
                    </Typography>
                    <CustomTextField
                        required
                        fullWidth
                        error={!!nameError}
                        helperText={nameError}
                        id="name"
                        variant="outlined"
                        placeholder="Insira o seu nome completo"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        onBlur={() => setNameTouched(true)}
                        sx={inputSx}
                    />

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
                        placeholder="Crie sua senha"
                        type={showPassword ? "text" : "password"}
                        value={userPassword}
                        onChange={(event) => setUserPassword(event.target.value)}
                        onBlur={() => setPasswordTouched(true)}
                        sx={inputSx}
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

                <Box sx={{ textAlign: "center", my: 2 }}>
                    <FormControlLabel
                        disabled
                        control={<Checkbox required size="small" />}
                        label={
                            <Typography variant="body2" sx={{ fontSize: { xs: "0.65rem", sm: "0.8rem" } }}>
                                Ao clicar em criar, você concorda com nossos
                                <br />
                                <Typography
                                    component="span"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        cursor: "pointer",
                                        fontWeight: "700",
                                        fontSize: "inherit",
                                    }}
                                    onClick={() => (window.location.href = "/termos")}
                                >
                                    Termos de Serviço
                                </Typography>{" "}
                                e{" "}
                                <Typography
                                    component="span"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        cursor: "pointer",
                                        fontWeight: "700",
                                        fontSize: "inherit",
                                    }}
                                    onClick={() => (window.location.href = "/privacidade")}
                                >
                                    Política de Privacidade
                                </Typography>
                            </Typography>
                        }
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            "& .MuiFormControlLabel-label": { marginLeft: "8px" },
                            "& .MuiFormControlLabel-asterisk": { display: "none" },
                        }}
                    />
                </Box>

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
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    Cadastrar conta
                </Button>
            </form>

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
