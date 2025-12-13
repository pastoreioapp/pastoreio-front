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
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";
import { useAppAuthentication } from "@/features/auth/useAppAuthentication";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

export default function PainelRegistro() {
    const navigate = useRouter();
    const appAuthentication = useAppAuthentication({
        onLoginSuccess: () => {
            navigate.push("/dashboard");
        }
    });

    const [userLogin, setUserLogin] = useState<string>();
    const [userName, setUserName] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleGoogleLoginButtonClick = () => {
		appAuthentication.runGoogleLogin();
	};

    const handleRegistrarButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userLogin && userName && userPassword) {
            appAuthentication.runPasswordUserLogin({
                login: userLogin,
                password: userPassword
            }).catch(() => {
				enqueueSnackbar('Falha ao registrar conta. Tente novamente mais tarde ou contate os administradores', { variant: "error" });
            });
        }
    };

	return (<>
		<Typography variant="h3" textAlign="center" mb={1}>
			Criar conta
		</Typography>

		<Box sx={{ display: "flex", alignItems: "center", my: 5 }}>
			<Divider sx={{ flexGrow: 1, borderColor: "#0000003b", height: 2 }}/>
		</Box>

		<form onSubmit={handleRegistrarButtonClick}>
			<Stack mb={3}>
			<Typography
				variant="subtitle1"
				fontWeight={600}
				component="label"
				htmlFor="login"
				mb="5px"
				color={"#173D8A"}
			>
				Login <span style={{ color: "red" }}>*</span>
			</Typography>
			<CustomTextField
				required
				fullWidth
				error={userLogin === ""}
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
				htmlFor="name"
				mb="5px"
				mt="25px"
				color={"#173D8A"}
			>
				Nome completo <span style={{ color: "red" }}>*</span>
			</Typography>
			<CustomTextField
				required
				fullWidth
				error={userName === ""}
				id="name"
				variant="outlined"
				placeholder="Insira o seu nome completo"
				value={userName}
				onChange={(event) => setUserName(event.target.value)}
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
				placeholder="Crie sua senha"
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
			<Box sx={{ textAlign: "center", my: 4 } }>
				<FormControlLabel disabled
					control={<Checkbox required size="small" />}
					label={
						<Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
							Ao clicar em criar, você concorda com nossos
							<br />
							<Typography
								component="span"
								sx={{
									color: "#173D8A",
									cursor: "pointer",
									fontWeight: "700",
								}}
								onClick={() => (window.location.href = "/termos")}
							>
								Termos de Serviço
							</Typography>{" "}
							e{" "}
							<Typography
								component="span"
								sx={{
									color: "#173D8A",
									cursor: "pointer",
									fontWeight: "700",
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
						"& .MuiFormControlLabel-label": {
							marginLeft: "8px",
						},
						"& .MuiFormControlLabel-asterisk": {
							display: "none",
						},
					}}
				/>
			</Box>
			<Button
				fullWidth
				type="submit"
				color="primary"
				variant="contained"
				size="large"
				sx={{ borderRadius: "50px", height: "50px", mt: 1 }}
			>
				Criar
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


		<Stack direction="row" justifyContent="center" spacing={1} mt={3}>
			<Typography variant="body1" fontWeight="400">
				Já tem uma conta?
			</Typography>
			<Typography
                variant="body1"
				component={Link}
				href="/login"
				fontWeight="700"
				sx={{ textDecoration: "none", color: "#173D8A" }}
			>
				Login
			</Typography>
		</Stack>
	</>);
}
