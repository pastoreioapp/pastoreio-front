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
  Snackbar,
  Alert,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppAuthentication } from "@/features/auth/useAppAuthentication";
import { AxiosError } from "axios";

export default function PainelLogin() {
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const navigate = useRouter();
    const appAuthentication = useAppAuthentication({
        onLoginSuccess: () => {
            navigate.push("/dashboard");
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [userLogin, setUserLogin] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleGoogleLoginButtonClick = () => {
        appAuthentication.runGoogleLogin();
    };

    const handleLoginButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userLogin && userPassword) {
            appAuthentication.runPasswordUserLogin({
                login: userLogin,
                password: userPassword
            }).catch((err: AxiosError) => {
                if(err.status == 401) {
                    setToastMsg('Usuário e/ou senha incorreto(s)');
                } else {
                    setToastMsg('Falha ao realizar o login. Tente novamente mais tarde ou contate os administradores');
                }
                setToastOpen(true);
            });
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

        <Snackbar
            open={toastOpen}
            autoHideDuration={3000}
            onClose={() => setToastOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert severity="error" variant="filled">
                {toastMsg}
            </Alert>
        </Snackbar>
    </>);
}
