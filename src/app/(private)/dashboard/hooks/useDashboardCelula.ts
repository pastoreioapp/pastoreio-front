"use client";

import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";

export function useDashboardCelula() {
    const { loggedUser } = useAppAuthentication();
    const celulaId = loggedUser?.celulaId ?? null;
    const ready = !!loggedUser?.id;
    const semCelula = ready && celulaId == null;

    return { celulaId, ready, semCelula };
}
