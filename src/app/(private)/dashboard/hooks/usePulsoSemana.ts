"use client";

import { useCallback, useEffect, useState } from "react";
import type { PulsoSemanaResult } from "@/modules/celulas/application/dashboard-dtos";
import { getPulsoSemana } from "@/app/actions/dashboard";

export function usePulsoSemana(celulaId: number | null | undefined) {
    const [data, setData] = useState<PulsoSemanaResult | null>(null);
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
            const result = await getPulsoSemana(celulaId);
            setData(result);
        } catch (error: unknown) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar pulso da semana");
        } finally {
            setLoading(false);
        }
    }, [celulaId]);

    useEffect(() => {
        void fetch();
    }, [fetch]);

    return { pulso: data, loading, erro, refetch: fetch };
}
