"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginType } from "../types/loginType";
import CustomTextField from "@/components/ui/CustomTextField";

export default function NewPassword({
  subtitle,
  subtext
}: loginType) {
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleClickShowPasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <Box>
      {subtitle}

      {subtext}

      <Stack>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
          mt="25px"
          color={"#000000"}
        >
          Insira uma nova senha<span style={{ color: "red" }}>*</span>
        </Typography>
        <CustomTextField
          id="password"
          variant="outlined"
          fullWidth
          placeholder="Nova senha"
          required
          type={showPasswordNew ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordNew}
                  edge="end"
                  sx={{ color: "#173D8A" }}
                >
                  {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
          mt="25px"
          color={"#000000"}
        >
          Confirme sua senha<span style={{ color: "red" }}>*</span>
        </Typography>
        <CustomTextField
          id="password"
          variant="outlined"
          fullWidth
          placeholder="Confirme sua senha"
          required
          type={showPasswordConfirm ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordConfirm}
                  edge="end"
                  sx={{ color: "#173D8A" }}
                >
                  {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/auth/login"
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
