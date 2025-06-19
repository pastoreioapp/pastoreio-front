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

export default function AuthRegister() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Typography variant="h3" textAlign="center" mb={1}>
        Login
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          my: 3,
        }}
      >
        <IconButton>
          <Link href={"#"}>
            <Image
              src="/images/icons/icon-google.svg"
              alt="Google Login"
              width={24}
              height={24}
              unoptimized
            />
          </Link>
        </IconButton>

        <IconButton>
          <Link href={"#"}>
            <Image
              src="/images/icons/icon-facebook.svg"
              alt="Google Login"
              width={28}
              height={28}
              unoptimized
            />
          </Link>
        </IconButton>

        <IconButton>
          <Link href={"#"}>
            <Image
              src="/images/icons/icon-apple.svg"
              alt="Google Login"
              width={22}
              height={22}
              unoptimized
            />
          </Link>
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          my: 3,
        }}
      >
        <Divider
          sx={{
            flexGrow: 1,
            bgcolor: "#173D8A",
            height: 2,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            px: 2,
            transform: "translateY(1px)",
            lineHeight: 1,
            mb: 1,
          }}
        >
          ou
        </Typography>
        <Divider
          sx={{
            flexGrow: 1,
            bgcolor: "#173D8A",
            height: 2,
          }}
        />
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
            placeholder="Digite seu endereço de e-mail"
          >
            Endereço de E-mail <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            placeholder="Digite seu endereço de e-mail"
            required
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
            Nome Completo <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomTextField
            id="name"
            variant="outlined"
            fullWidth
            placeholder="Insira o seu nome completo"
            required
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
            placeholder="Crie sua senha"
            required
            type={showPassword ? "text" : "password"}
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
        <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
          <FormControlLabel
            control={<Checkbox required size="small" />}
            label={
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                Ao clicar em criar, você concorda com nossos
                <br />
                <Typography
                  component="span"
                  sx={{
                    color: "#173D8A",
                    textDecoration: "underline",
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
                    textDecoration: "underline",
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
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          component={Link}
          href="/auth/login"
          sx={{
            borderRadius: "50px",
            height: "50px",
          }}
        >
          Criar
        </Button>
      </Box>
      <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
        <Typography variant="body1" fontWeight="400">
          Já tem uma conta?
        </Typography>
        <Typography
          component={Link}
          href="/auth/login"
          fontWeight="700"
          sx={{
            textDecoration: "underline",
            color: "#173D8A",
          }}
        >
          Login
        </Typography>
      </Stack>
    </>
  );
}
