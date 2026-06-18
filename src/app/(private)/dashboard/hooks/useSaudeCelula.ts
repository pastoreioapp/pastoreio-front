"use client";

import { useCallback, useEffect, useState } from "react";
import type { SaudeCelulaResult } from "@/modules/celulas/application/saude-dtos";
import { getSaudeCelula } from "@/app/actions/dashboard";

export function useSaudeCelula(celulaId: number | null | undefined) {
    const [data, setData] = useState<SaudeCelulaResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        if (celulaId == null) {
            setData(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErro(null);
            const result = await getSaudeCelula(celulaId);
            setData(result);
        } catch (error: unknown) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar saúde da célula");
        } finally {
            setLoading(false);
        }
    }, [celulaId]);

    useEffect(() => {
        void fetch();
    }, [fetch]);

    return { saude: data, loading, erro, refetch: fetch };
}
