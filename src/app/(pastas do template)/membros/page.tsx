import DashboardCard from "@/components/DashboardCard";
import PageContainer from "@/components/PageContainer";
import { Typography } from "@mui/material";

export default function Membros() {
  return (
    <PageContainer title="Membros" description="Página Membros">
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
