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
import { useRouter } from "next/navigation";
import { useAppAuthentication } from "@/features/auth/useAppAuthentication";

export default function AuthLogin() {
    const navigate = useRouter();
    const appAuthentication = useAppAuthentication();

    const [showPassword, setShowPassword] = useState(false);
    const [userLogin, setUserLogin] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleGoogleLoginButtonClick = () => {
        appAuthentication.useRunGoogleUserLogin(() => {
            navigate.push("/dashboard");
        });
    };
    const handleLoginButtonClick = () => {
        if(userLogin && userPassword) {
            const user = {
                login: userLogin,
                password: userPassword
            }
            appAuthentication.runPasswordUserLogin(user)
                .then(() => {
                     navigate.push("/dashboard");
                });
        }
    };

    return (<>
        <Typography variant="h3" textAlign="center" mb={3}>
            Login
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
            <Divider sx={{ flexGrow: 1, bgcolor: "#173D8A", height: 2 }}/>
        </Box>

        <Box>
            <Stack mb={3}>
            <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="email"
                mb="5px"
                color={"#173D8A"}
                placeholder="Digite seu login"
            >
                Login <span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                placeholder="Digite seu login"
                required
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
                id="password"
                variant="outlined"
                fullWidth
                placeholder="Digite sua senha"
                required
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
            <Box sx={{ width: "100%", textAlign: "left", mt: 2, mb: 5 }}>
            <Stack direction="row" justifyContent="right" spacing={1} mt={3}>
                <Typography variant="body1" fontWeight="400">
                    Esqueceu a Senha ?
                </Typography>
                <Typography
                    variant="body1"
                    component={Link}
                    href="/recover"
                    fontWeight="700"
                    sx={{ textDecoration: "underline", color: "#173D8A" }}
                >
                Recuperar
                </Typography>
            </Stack>
            </Box>
            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={handleLoginButtonClick}
                sx={{ borderRadius: "50px", height: "50px" }}
            >
                Login
            </Button>
            
            <Button fullWidth
                color="primary"
                variant="outlined"
                size="large"
                onClick={handleGoogleLoginButtonClick}
                sx={{ borderRadius: "50px", height: "50px", mt: 2 }}
                InputProps={{ endAdornment: (
                    <InputAdornment position="start">
                        <IconButton edge="start" sx={{ color: "#173D8A" }} >
                            <Image
                                src="/images/icons/icon-google.svg"
                                alt="Google Login"
                                width={24}
                                height={24}
                                unoptimized/>
                        </IconButton>
                    </InputAdornment>
                )}}
            >
                Entrar com o Google
            </Button>
            
            <IconButton edge="start" sx={{ color: "#173D8A" }}>
                <Image
                    src="/images/icons/icon-google.svg"
                    alt="Google Login"
                    width={24}
                    height={24}
                    unoptimized/>
            </IconButton>
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
            Ainda não possui uma conta ?
            </Typography>
            <Typography
            variant="body1"
            component={Link}
            href="/register"
            fontWeight="700"
            sx={{
                textDecoration: "underline",
                color: "#173D8A",
            }}
            >
            Cadastre-se
            </Typography>
        </Stack>
    </>);
}
