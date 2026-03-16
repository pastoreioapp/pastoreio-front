import UnderConstructionCard from "@/ui/components/ui/UnderConstructionCard";
import { ProtectedRoute } from "@/ui/components/auth/ProtectedRoute";
import { LIDER_ONLY_ROLES } from "@/modules/controleacesso/domain/navigation";
import { IconGrowth } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Multiplicação",
    description: "Acompanhamento de novas células e crescimento",
};

export default function Multiplicacao() {
    return (
        <ProtectedRoute allowedRoles={LIDER_ONLY_ROLES}>
            <UnderConstructionCard
                title="Multiplicação em construção"
                description="Esta área será dedicada ao acompanhamento do processo de multiplicação de novas células."
                icon={<IconGrowth size={40} stroke={1.5} />}
                items={[
                    "Cadastro e acompanhamento de novas células",
                    "Cronograma e etapas de multiplicação"
                ]}
            />
        </ProtectedRoute>
    );
}
