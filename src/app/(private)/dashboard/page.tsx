import UnderConstructionCard from "@/ui/components/ui/UnderConstructionCard";
import { ProtectedRoute } from "@/ui/components/auth/ProtectedRoute";
import { LIDER_ONLY_ROLES } from "@/modules/controleacesso/domain/navigation";
import { IconChartBar } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Visão geral da célula e métricas",
};

export default function Dashboard() {
    return (
        <ProtectedRoute allowedRoles={LIDER_ONLY_ROLES}>
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
        </ProtectedRoute>
    );
}
