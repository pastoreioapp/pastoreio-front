import DashboardCard from "@/components/DashboardCard";
import PageContainer from "@/components/PageContainer";
import { Typography } from "@mui/material";

export default function Encontros() {
  return (
    <PageContainer title="Encontros" description="Página Encontros">
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
