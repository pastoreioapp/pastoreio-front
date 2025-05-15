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

export default function AuthLogin() {
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
              width={24}
              height={24}
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
            placeholder="Senha"
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
        <Box sx={{ width: "100%", textAlign: "left", mt: 2, mb: 5 }}>
          <Stack direction="row" justifyContent="right" spacing={1} mt={3}>
            <Typography variant="body1" fontWeight="400">
              Esqueceu a Senha ?
            </Typography>
            <Typography
              variant="body1"
              component={Link}
              href="/auth/recover"
              fontWeight="700"
              sx={{
                textDecoration: "underline",
                color: "#173D8A",
              }}
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
          component={Link}
          href="/dashboard"
          sx={{
            borderRadius: "50px",
            height: "50px",
          }}
        >
          Login
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
          Ainda não possui uma conta ?
        </Typography>
        <Typography
          variant="body1"
          component={Link}
          href="/auth/register"
          fontWeight="700"
          sx={{
            textDecoration: "underline",
            color: "#173D8A",
          }}
        >
          Cadastre-se
        </Typography>
      </Stack>
    </>
  );
}
