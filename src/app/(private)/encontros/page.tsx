import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Typography } from "@mui/material";

export default function Encontros() {
  return (
    <PageContainer title="Encontros" description="Página Encontros" allowedRoles={['LIDER_CELULA']}>
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
