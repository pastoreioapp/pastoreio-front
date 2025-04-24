import DashboardCard from "@/components/DashboardCard";
import PageContainer from "@/components/PageContainer";
import { Typography } from "@mui/material";

export default function SamplePage() {
    return (
        <PageContainer title="Sample Page" description="this is Sample page">
            <DashboardCard title="Sample Page">
                <Typography>This is a sample page</Typography>
            </DashboardCard>
        </PageContainer>
    );
}
