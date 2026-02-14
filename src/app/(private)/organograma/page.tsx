import PageContainer from "@/ui/components/pages/PageContainer";
import UnderConstructionCard from "@/ui/components/ui/UnderConstructionCard";
import { CELULA_ROLES } from "@/modules/controleacesso/domain/types";
import { IconGitBranch } from "@tabler/icons-react";

export default function Organograma() {
    return (
        <PageContainer title="Organograma" description="Estrutura e hierarquia da célula" allowedRoles={CELULA_ROLES}>
            <UnderConstructionCard
                title="Organograma em construção"
                description="Aqui você poderá visualizar a estrutura da célula, líderes, discipulados e a rede de relacionamentos."
                icon={<IconGitBranch size={40} stroke={1.5} />}
                items={[
                    "Visualização em árvore da estrutura",
                    "Líderes e co-líderes por célula",
                    "Relação de discipulado e multiplicação",
                ]}
            />
        </PageContainer>
    );
}
