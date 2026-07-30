import { ProtectedRoute } from "@/ui/components/auth/ProtectedRoute";
import { LIDER_ONLY_ROLES } from "@/modules/controleacesso/domain/navigation";
import { CelulasScreen } from "./components/CelulasScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Células",
  description: "Gestão de células",
};

export default function CelulasPage() {
  return (
    <ProtectedRoute allowedRoles={LIDER_ONLY_ROLES}>
      <CelulasScreen />
    </ProtectedRoute>
  );
}
