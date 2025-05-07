"use client";

// Importações Next
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import {
  Box,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";

import { loginType } from "../types/loginType";
import CustomTextField from "@/components/ui/CustomTextField";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Props } from "react-apexcharts";

export default function AuthLogin({ subtitle, subtext, subtext2}: loginType) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* texto Login */}
      {subtext}

      {/* Links das redes sociais */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          my: 3,
        }}
      >
        {/* Icon Google */}
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

        {/* Icon Facebook */}
        <IconButton>
          <Link href={"#"}>
            <Image
              src="/images/icons/icon-facebook.png"
              alt="Google Login"
              width={28}
              height={28}
              unoptimized
            />
          </Link>
        </IconButton>

        {/* Icon Apple*/}
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

      {/* ----- */}
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

      {/* Inputs | Checkbox | Button */}
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
        <Box sx={{ width: "100%", textAlign: "left", mt: 2, mb: 5 }}>{subtext2}</Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          component={Link}
          href="/dashboard"
          sx={{
            borderRadius: "50px",
            height: "50px"
          }}
        >
          Login
        </Button>
      </Box>
      {subtitle}
    </>
  );
}
