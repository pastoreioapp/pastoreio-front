import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Typography } from "@mui/material";

export default function Orgonograma() {
  return (
    <PageContainer title="Orgonograma" description="Página Orgonograma">
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
