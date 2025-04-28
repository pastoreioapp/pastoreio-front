import PageContainer from "@/components/PageContainer";
import Blog from "@/app/(pastas do template)/dashboard/components/Blog";
import MonthlyEarnings from "@/app/(pastas do template)/dashboard/components/MonthlyEarnings";
import ProductPerformance from "@/app/(pastas do template)/dashboard/components/ProductPerformance";
import RecentTransactions from "@/app/(pastas do template)/dashboard/components/RecentTransactions";
import SalesOverview from "@/app/(pastas do template)/dashboard/components/SalesOverview";
import YearlyBreakup from "@/app/(pastas do template)/dashboard/components/YearlyBreakup";
import { Grid, Box } from "@mui/material";

export default function Dashboard() {
    return (
        <PageContainer title="Dashboard" description="this is Dashboard">
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
