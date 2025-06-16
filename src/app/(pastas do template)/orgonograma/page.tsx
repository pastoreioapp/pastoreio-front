import DashboardCard from "@/components/DashboardCard";
import PageContainer from "@/components/PageContainer";
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
