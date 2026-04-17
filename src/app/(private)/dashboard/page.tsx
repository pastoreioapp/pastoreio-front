import { ProtectedRoute } from "@/ui/components/auth/ProtectedRoute";
import { LIDER_ONLY_ROLES } from "@/modules/controleacesso/domain/navigation";
import { DashboardScreen } from "./components/DashboardScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Central da célula com insights e ações para o líder",
};

export default function Dashboard() {
    return (
        <ProtectedRoute allowedRoles={LIDER_ONLY_ROLES}>
            <DashboardScreen />
        </ProtectedRoute>
    );
}
