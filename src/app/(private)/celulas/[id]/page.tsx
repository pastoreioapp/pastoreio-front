import { ProtectedRoute } from "@/ui/components/auth/ProtectedRoute";
import { LIDER_ONLY_ROLES } from "@/modules/controleacesso/domain/navigation";
import { CelulaDetalheScreen } from "./components/CelulaDetalheScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes da Célula",
  description: "Informações e membros da célula",
};

type Props = {
  params: { id: string };
};

export default function CelulaDetalhePage({ params }: Props) {
  const celulaId = Number(params.id);

  return (
    <ProtectedRoute allowedRoles={LIDER_ONLY_ROLES}>
      <CelulaDetalheScreen celulaId={celulaId} />
    </ProtectedRoute>
  );
}
