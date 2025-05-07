"use client";

import Link from "next/link";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";

import { loginType } from "../types/loginType";
import CustomTextField from "@/components/ui/CustomTextField";

export default function RecoverPassword({
  subtitle,
  subtext,
}: loginType) {
  return (
    <Box>
      {subtitle}

      {subtext}
      <Box
        sx={{
          width: "80%",
          display: "flex",
          alignItems: "center",
          mb: 6,
          marginX: "auto"
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
      </Stack>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/auth/receiveCode"
        sx={{
          borderRadius: "50px",
          marginTop: "50px",
          marginBottom: "20px",
          height: "50px",
        }}
      >
        Recuperar senha
      </Button>
    </Box>
  );
}
