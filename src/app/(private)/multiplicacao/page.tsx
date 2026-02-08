import PageContainer from "@/ui/components/pages/PageContainer";
import UnderConstructionCard from "@/ui/components/ui/UnderConstructionCard";
import { CELULA_ROLES } from "@/modules/controleacesso/domain/types";
import { IconGrowth } from "@tabler/icons-react";

export default function Multiplicacao() {
    return (
        <PageContainer title="Multiplicação" description="Acompanhamento de novas células e crescimento" allowedRoles={CELULA_ROLES}>
            <UnderConstructionCard
                title="Multiplicação em construção"
                description="Esta área será dedicada ao acompanhamento do processo de multiplicação de novas células."
                icon={<IconGrowth size={40} stroke={1.5} />}
                items={[
                    "Cadastro e acompanhamento de novas células",
                    "Cronograma e etapas de multiplicação"
                ]}
            />
        </PageContainer>
    );
}
