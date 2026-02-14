import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import DashboardCard from "./DashboardCard";

type Props = {
    title: string;
    description: string;
    icon: ReactNode;
    items?: string[];
};

export default function UnderConstructionCard({ title, description, icon, items }: Props) {
    return (
        <DashboardCard>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 6,
                    px: 2,
                    textAlign: "center",
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "primary.light",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mb: items?.length ? 3 : 0 }}>
                    {description}
                </Typography>
                {items && items.length > 0 && (
                    <Box sx={{ textAlign: "left", maxWidth: 360 }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                            Em breve:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.secondary" }}>
                            {items.map((item, i) => (
                                <Typography key={i} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </DashboardCard>
    );
}
