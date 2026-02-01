import DashboardCard from "@/ui/components/ui/DashboardCard";
import PageContainer from "@/ui/components/pages/PageContainer";
import { Typography } from "@mui/material";
import { CELULA_ROLES } from "@/modules/controleacesso/domain/types";

export default function Organograma() {
  return (
    <PageContainer title="Organograma" description="Página Organograma" allowedRoles={CELULA_ROLES}>
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
