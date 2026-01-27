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
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppAuthentication } from "@/features/auth/useAppAuthentication";
import { enqueueSnackbar } from "notistack";

export default function PainelLogin() {
    const appAuthentication = useAppAuthentication();

    const [showPassword, setShowPassword] = useState(false);
    const [userLogin, setUserLogin] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleGoogleLoginButtonClick = async () => {
        try {
            await appAuthentication.runGoogleLogin();
        } catch (error: any) {
            enqueueSnackbar('Falha ao realizar login com Google. Tente novamente.', { variant: "error" });
        }
    };

    const handleLoginButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userLogin && userPassword) {
            try {
                await appAuthentication.runPasswordUserLogin({
                    login: userLogin,
                    password: userPassword
                });
            } catch (error: any) {
                if (error.message?.includes('Invalid login credentials') || error.status === 401) {
                    enqueueSnackbar('Usuário e/ou senha incorreto(s)', { variant: "error" });
                } else {
                    enqueueSnackbar('Falha ao realizar o login. Tente novamente mais tarde ou contate os administradores', { variant: "error" });
                }
            }
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
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="login"
                        mb="5px"
                        color={"#173D8A"}
                        placeholder="Digite seu login"
                    >
                        Login <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <CustomTextField
                        required
                        error={userLogin === ""}
                        fullWidth
                        id="login"
                        variant="outlined"
                        placeholder="Digite seu login"
                        value={userLogin}
                        onChange={(event) => setUserLogin(event.target.value)}
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
