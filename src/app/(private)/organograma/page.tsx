import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Typography } from "@mui/material";
import { CELULA_ROLES } from "@/features/auth/types";

export default function Organograma() {
  return (
    <PageContainer title="Organograma" description="Página Organograma" allowedRoles={CELULA_ROLES}>
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
