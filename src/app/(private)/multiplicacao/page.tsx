import { ProtectedRoute } from "@/ui/components/auth/ProtectedRoute";
import { LIDER_ONLY_ROLES } from "@/modules/controleacesso/domain/navigation";
import { MultiplicacaoScreen } from "./components/MultiplicacaoScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multiplicacao",
  description: "Acompanhamento de novas celulas e crescimento",
};

export default function Multiplicacao() {
  return (
    <ProtectedRoute allowedRoles={LIDER_ONLY_ROLES}>
      <MultiplicacaoScreen />
    </ProtectedRoute>
  );
}
