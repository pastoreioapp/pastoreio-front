import PageContainer from "@/components/pages/PageContainer";
import Blog from "@/app/(private)/dashboard/components/Blog";
import MonthlyEarnings from "@/app/(private)/dashboard/components/MonthlyEarnings";
import ProductPerformance from "@/app/(private)/dashboard/components/ProductPerformance";
import RecentTransactions from "@/app/(private)/dashboard/components/RecentTransactions";
import SalesOverview from "@/app/(private)/dashboard/components/SalesOverview";
import YearlyBreakup from "@/app/(private)/dashboard/components/YearlyBreakup";
import { Grid, Box } from "@mui/material";
import { CELULA_ROLES } from "@/features/auth/types";

export default function Dashboard() {
    return (
        <PageContainer title="Dashboard" description="this is Dashboard" allowedRoles={CELULA_ROLES}>
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <SalesOverview />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <YearlyBreakup />
                            </Grid>
                            <Grid item xs={12}>
                                <MonthlyEarnings />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <RecentTransactions />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <ProductPerformance />
                    </Grid>
                    <Grid item xs={12}>
                        <Blog />
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
}
