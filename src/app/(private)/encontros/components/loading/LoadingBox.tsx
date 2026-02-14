import { Box, CircularProgress } from "@mui/material";

export function LoadingBox() {
    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
        </Box>
    );
}
