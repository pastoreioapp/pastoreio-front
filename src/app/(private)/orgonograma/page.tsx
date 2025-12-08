import DashboardCard from "@/components/ui/DashboardCard";
import PageContainer from "@/components/pages/PageContainer";
import { Typography } from "@mui/material";
import { CELULA_ROLES } from "@/features/auth/types";

export default function Orgonograma() {
  return (
    <PageContainer title="Orgonograma" description="Página Orgonograma" allowedRoles={CELULA_ROLES}>
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
