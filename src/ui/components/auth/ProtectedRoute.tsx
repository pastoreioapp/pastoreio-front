"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { hasRequiredRole } from "@/modules/controleacesso/domain/navigation";

type Props = {
    children: React.ReactNode,
    allowedRoles?: readonly string[]
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
    const router = useRouter();
    const { loggedUser, userIsAuthenticated } = useAppAuthentication();
    const isAuthenticated = userIsAuthenticated();
    const hasLoggedUser = Boolean(loggedUser?.id);
    const requiresRoles = Boolean(allowedRoles && allowedRoles.length > 0);
    const hasSomeRole = requiresRoles
        ? hasRequiredRole(loggedUser?.perfis, allowedRoles)
        : true;
    const shouldRedirectUnauthorized =
        isAuthenticated && hasLoggedUser && requiresRoles && !hasSomeRole;

    useEffect(() => {
        if (shouldRedirectUnauthorized) {
            router.replace("/nao-autorizado");
        }
    }, [router, shouldRedirectUnauthorized]);

    if(!requiresRoles) {
        if(!isAuthenticated) return null;

        return <>{children}</>;
    }

    if(!isAuthenticated || !hasLoggedUser) {
        return null;
    }

    if(shouldRedirectUnauthorized) {
        return null;
    }

    return <>{children}</>;
}
