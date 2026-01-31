"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import { Visibility, VisibilityOff, Email, Phone } from "@mui/icons-material";
import { useAppAuthentication } from "@/features/auth/useAppAuthentication";
import { enqueueSnackbar } from "notistack";
import {
  getLoginValidationError,
  isValidEmail,
  isValidPhone,
} from "@/utils/validation";

export type LoginType = "email" | "phone";

export default function PainelLogin() {
    const appAuthentication = useAppAuthentication();

    const [loginType, setLoginType] = useState<LoginType>("email");
    const [showPassword, setShowPassword] = useState(false);
    const [userLogin, setUserLogin] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");
    const [loginTouched, setLoginTouched] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginTypeChange = (_: React.MouseEvent<HTMLElement>, newType: LoginType | null) => {
        if (newType) {
            setLoginType(newType);
            setUserLogin("");
            setLoginTouched(false);
        }
    };
    
    const handleGoogleLoginButtonClick = async () => {
        try {
            await appAuthentication.runGoogleLogin();
        } catch (error: any) {
            enqueueSnackbar('Falha ao realizar login com Google. Tente novamente.', { variant: "error" });
        }
    };

    const isLoginValid = (): boolean => {
        if (!userLogin.trim()) return false;
        return loginType === "email" ? isValidEmail(userLogin.trim()) : isValidPhone(userLogin.trim());
    };

    const loginError = loginTouched ? getLoginValidationError(userLogin, loginType) : null;

    const handleLoginButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginTouched(true);

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

    return (<>
        <Typography variant="h3" textAlign="center" mb={3}>
            Login
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", my: 5 }}>
            <Divider sx={{ flexGrow: 1, borderColor: "#0000003b", height: 2 }}/>
        </Box>

        <Box>
            <form onSubmit={handleLoginButtonClick}>
                <Stack mb={3}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="login"
                            color={"#173D8A"}
                        >
                            {loginType === "email" ? "Email" : "Telefone"}{" "}
                            <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <ToggleButtonGroup
                            value={loginType}
                            exclusive
                            onChange={handleLoginTypeChange}
                            size="small"
                            sx={{ "& .MuiToggleButton-root": { py: 0.5, px: 1.5 } }}
                        >
                            <ToggleButton value="email" aria-label="Entrar com email">
                                <Email sx={{ fontSize: 18, mr: 0.5 }} />
                                Email
                            </ToggleButton>
                            <ToggleButton value="phone" aria-label="Entrar com telefone">
                                <Phone sx={{ fontSize: 18, mr: 0.5 }} />
                                Telefone
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <CustomTextField
                        required
                        fullWidth
                        error={!!loginError}
                        helperText={loginError}
                        id="login"
                        variant="outlined"
                        type={loginType === "email" ? "email" : "tel"}
                        placeholder={
                            loginType === "email"
                                ? "Digite seu email"
                                : "Ex: 11 99999-9999"
                        }
                        value={userLogin}
                        onChange={(event) => setUserLogin(event.target.value)}
                        onBlur={() => setLoginTouched(true)}
                    />

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="password"
                        mb="5px"
                        mt="25px"
                        color={"#173D8A"}
                    >
                        Senha <span style={{ color: "red" }}>*</span>
                    </Typography>

                    <CustomTextField
                        required
                        fullWidth
                        error={userPassword === ""}
                        id="password"
                        variant="outlined"
                        placeholder="Digite sua senha"
                        type={showPassword ? "text" : "password"}
                        value={userPassword}
                        onChange={(event) => setUserPassword(event.target.value)}
                        InputProps={{ 
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                sx={{ color: "#173D8A" }}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                    />
                </Stack>
                <Box sx={{ width: "100%", mt: 2, mb: 8 }}>
                    <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                        <Typography variant="body1" fontWeight="400">
                            Esqueceu a Senha?
                        </Typography>
                        <Typography
                            variant="body1"
                            component={Link}
                            href="/recover"
                            fontWeight="700"
                            sx={{ textDecoration: "none", color: "#173D8A" }}
                        >
                        Recuperar
                        </Typography>
                    </Stack>
                </Box>
                <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: "50px", height: "50px" }}
                >
                    Login
                </Button>
            </form>
            
            <Button fullWidth
                color="inherit"
                variant="text"
                size="medium"
                onClick={handleGoogleLoginButtonClick}
                sx={{ borderRadius: "50px", height: "50px", mt: 1, textTransform: 'none' }}
                startIcon={<Image
                    src="/images/icons/icon-google.svg"
                    alt="Google Login"
                    width={20}
                    height={20}
                    unoptimized
                />}
            >
                Continuar com o Google
            </Button>
        </Box>

        <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            mt={3}
            sx={{
                width: "100%",
                maxWidth: "100%",
                display: "flex",
                flexWrap: "wrap",
            }}
        >
            <Typography variant="body1" fontWeight="400">
                Ainda não possui uma conta?
            </Typography>
            <Typography
                variant="body1"
                component={Link}
                href="/register"
                fontWeight="700"
                sx={{ textDecoration: "none", color: "#173D8A" }}
            >
                Cadastre-se
            </Typography>
        </Stack>
    </>);
}
