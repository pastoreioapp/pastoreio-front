"use client";

import { useRouter } from "next/navigation";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";

type Props = {
    children: React.ReactNode,
    allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
    // TODO: remover isso quando a tabela de perfis for criada
    allowedRoles = [];
    const router = useRouter();
    const { loggedUser, userIsAuthenticated } = useAppAuthentication();

    if(!allowedRoles || allowedRoles.length === 0) {
        if(!userIsAuthenticated()) return null;

        return <>{children}</>;
    }

    if(!userIsAuthenticated() || !loggedUser || !loggedUser.id) {
        return null;
    }

    const hasSomeRole = allowedRoles.some(role => loggedUser.perfis?.includes(role));

    if(!hasSomeRole) {
        router.push('/nao-autorizado');
        return null;
    }

    return <>{children}</>;
}
