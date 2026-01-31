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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Visibility, VisibilityOff, Email, Phone } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";
import { useAppAuthentication } from "@/features/auth/useAppAuthentication";
import { enqueueSnackbar } from "notistack";
import {
  getLoginValidationError,
  getPasswordValidationError,
  formatPhoneToE164,
  isValidEmail,
  isValidPhone,
} from "@/utils/validation";

export type RegisterLoginType = "email" | "phone";

export default function PainelRegistro() {
    const appAuthentication = useAppAuthentication();

    const [loginType, setLoginType] = useState<RegisterLoginType>("email");
    const [userLogin, setUserLogin] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState(false);
	const [loginTouched, setLoginTouched] = useState(false);
	const [nameTouched, setNameTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleLoginTypeChange = (_: React.MouseEvent<HTMLElement>, newType: RegisterLoginType | null) => {
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
                const errorMessage = error.message || 'Falha ao registrar conta. Tente novamente mais tarde ou contate os administradores';
                enqueueSnackbar(errorMessage, { variant: "error" });
            }
        } else {
			enqueueSnackbar("Preencha todos os campos obrigatórios.", { variant: "error" });
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
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
				<Typography
					variant="subtitle1"
					fontWeight={600}
					component="label"
					htmlFor="login"
					color={"#173D8A"}
				>
					{loginType === "email" ? "Email" : "Telefone"} <span style={{ color: "red" }}>*</span>
				</Typography>
				<ToggleButtonGroup
					value={loginType}
					exclusive
					onChange={handleLoginTypeChange}
					size="small"
					sx={{ "& .MuiToggleButton-root": { py: 0.5, px: 1.5 } }}
				>
					<ToggleButton value="email" aria-label="Registrar com email">
						<Email sx={{ fontSize: 18, mr: 0.5 }} />
						Email
					</ToggleButton>
					<ToggleButton value="phone" aria-label="Registrar com telefone">
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
				placeholder={loginType === "email" ? "Digite seu email" : "Ex: 11 99999-9999"}
				value={userLogin}
				onChange={(event) => setUserLogin(event.target.value)}
				onBlur={() => setLoginTouched(true)}
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
				error={!!nameError}
				helperText={nameError}
				id="name"
				variant="outlined"
				placeholder="Insira o seu nome completo"
				value={userName}
				onChange={(event) => setUserName(event.target.value)}
				onBlur={() => setNameTouched(true)}
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
				error={!!passwordError}
				helperText={passwordError}
				id="password"
				variant="outlined"
				placeholder="Crie sua senha"
				type={showPassword ? "text" : "password"}
				value={userPassword}
				onChange={(event) => setUserPassword(event.target.value)}
				onBlur={() => setPasswordTouched(true)}
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
