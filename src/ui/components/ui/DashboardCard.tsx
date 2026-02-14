import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { ReactNode } from "react";

type Props = {
    headerTitle?: ReactNode;
    headerSubtitle?: ReactNode;
    action?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
};

export default function DashboardCard({
    headerTitle,
    headerSubtitle,
    action,
    children,
    footer,
}: Props) {
    return (
        <Card sx={{ px: 5, py: 0, m: 0 }} elevation={0}>
            {(headerTitle || headerSubtitle || action) && (
                <CardContent sx={{ px: 0, py: 2 }}>
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                    >
                        <Box>
                            {headerTitle && (
                                <Typography variant="h5">
                                    {headerTitle}
                                </Typography>
                            )}
                            {headerSubtitle && (
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    {headerSubtitle}
                                </Typography>
                            )}
                        </Box>
                        {action}
                    </Stack>
                </CardContent>
            )}

            <CardContent sx={{ px: 0, py: 0 }}>{children}</CardContent>

            {footer && <Box sx={{ mt: 2 }}>{footer}</Box>}
        </Card>
    );
}
