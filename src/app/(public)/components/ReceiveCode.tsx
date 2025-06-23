"use client";

import Link from "next/link";
import { Box, Typography, Button, Stack } from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";

export default function ReceiveCode() {
  return (
    <Box>
      <Typography variant="h3" textAlign="center" fontWeight="900">
        Recuperar senha
      </Typography>

      <Stack
        width={"100%"}
        display={"flex"}
        alignContent={"center"}
        alignItems={"center"}
        direction="row"
        justifyContent="center"
        flexWrap={"wrap"}
        textAlign={"center"}
        spacing={1}
        p={1}
        mb={10}
        color={"#173D8A"}
      >
        <Typography variant="body1" fontWeight="600">
          Enviamos um código para pasto******@gmail.com
        </Typography>
      </Stack>

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
      <Stack
        direction="row"
        justifyContent="center"
        flexWrap={"wrap"}
        spacing={1}
        mt={1}
      >
        <Typography variant="body1" fontWeight="400">
          Não recebeu o código ?
        </Typography>
        <Typography
          variant="body1"
          component={Link}
          href="//receiveCode"
          fontWeight="700"
          sx={{
            textDecoration: "underline",
            color: "#173D8A",
          }}
        >
          Reenviar 30s
        </Typography>
      </Stack>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="//newPassword"
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
