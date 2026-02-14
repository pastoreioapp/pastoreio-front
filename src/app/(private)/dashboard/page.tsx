import PageContainer from "@/ui/components/pages/PageContainer";
import UnderConstructionCard from "@/ui/components/ui/UnderConstructionCard";
import { CELULA_ROLES } from "@/modules/controleacesso/domain/types";
import { IconChartBar } from "@tabler/icons-react";

export default function Dashboard() {
    return (
        <PageContainer title="Dashboard" description="Visão geral da célula e métricas" allowedRoles={CELULA_ROLES}>
            <UnderConstructionCard
                title="Dashboard em construção"
                description="Em breve você terá uma visão consolidada da sua célula: indicadores, crescimento e atividades recentes."
                icon={<IconChartBar size={40} stroke={1.5} />}
                items={[
                    "Resumo de membros e encontros",
                    "Gráficos de frequência e crescimento",
                    "Atividades e próximos compromissos",
                ]}
            />
        </PageContainer>
    );
}
