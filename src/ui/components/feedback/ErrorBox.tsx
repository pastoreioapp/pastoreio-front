import { Alert, Box } from "@mui/material";

export function ErrorBox({ message }: { message: string }) {
    return (
        <Box mt={4}>
            <Alert severity="error">{message}</Alert>
        </Box>
    );
}
