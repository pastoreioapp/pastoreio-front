"use client";

import Link from "next/link";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";

import { loginType } from "../types/loginType";
import CustomTextField from "@/components/ui/CustomTextField";

export default function ReceiveCode({
  subtitle,
  subtext,
  subtext2,
}: loginType) {
  return (
    <Box>
      {subtitle}

      {subtext}

      <Stack>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="email"
          color={"#000000"}
        >
          Informe o código recebido:
        </Typography>
        <CustomTextField
          id="email"
          variant="outlined"
          fullWidth
          placeholder="Código"
          required
        />
      </Stack>
      {subtext2}
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/auth/newPassword"
        sx={{
          borderRadius: "50px",
          marginTop: "50px",
          marginBottom: "20px",
          height: "50px",
        }}
      >
        Confirmar
      </Button>
    </Box>
  );
}
