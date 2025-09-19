import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Typography } from "@mui/material";

export default function Multiplicacao() {
  return (
    <PageContainer title="Multiplicação" description="Página Multiplicação" allowedRoles={['LIDER_CELULA']}>
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
