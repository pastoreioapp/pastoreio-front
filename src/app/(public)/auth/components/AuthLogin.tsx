"use client";

import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "../types/loginType";
import CustomTextField from "@/components/ui/CustomTextField";

export default function AuthLogin({ title, subtitle, subtext }: loginType) {
    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="username"
                        mb="5px"
                    >
                        Username
                    </Typography>
                    <CustomTextField
                        id="username"
                        variant="outlined"
                        fullWidth
                    />
                </Box>
                <Box mt="25px">
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="password"
                        mb="5px"
                    >
                        Password
                    </Typography>
                    <CustomTextField
                        type="password"
                        id="password"
                        variant="outlined"
                        fullWidth
                    />
                </Box>
                <Stack
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    my={2}
                >
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remeber this Device"
                        />
                    </FormGroup>
                    <Typography
                        component={Link}
                        href="/dashboard"
                        fontWeight="500"
                        sx={{
                            textDecoration: "none",
                            color: "primary.main",
                        }}
                    >
                        Forgot Password ?
                    </Typography>
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    component={Link}
                    href="/dashboard"
                    type="submit"
                >
                    Sign In
                </Button>
            </Box>
            {subtitle}
        </>
    );
}
