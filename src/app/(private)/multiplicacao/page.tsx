import DashboardCard from "@/ui/components/ui/DashboardCard";
import PageContainer from "@/ui/components/pages/PageContainer";
import { Typography } from "@mui/material";
import { CELULA_ROLES } from "@/modules/controleacesso/domain/types";

export default function Multiplicacao() {
  return (
    <PageContainer title="Multiplicação" description="Página Multiplicação" allowedRoles={CELULA_ROLES}>
      <DashboardCard>
        <Typography>Conteúdo em breve</Typography>
      </DashboardCard>
    </PageContainer>
  );
}
