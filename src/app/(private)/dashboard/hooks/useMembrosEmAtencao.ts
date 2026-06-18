"use client";

import { useCallback, useEffect, useState } from "react";
import type { MembroEmAtencaoResult } from "@/modules/celulas/application/atencao-dtos";
import { getMembrosEmAtencao } from "@/app/actions/dashboard";

export function useMembrosEmAtencao(celulaId: number | null | undefined) {
    const [data, setData] = useState<MembroEmAtencaoResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        if (celulaId == null) {
            setData([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErro(null);
            const result = await getMembrosEmAtencao(celulaId);
            setData(result);
        } catch (error: unknown) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar membros em atenção");
        } finally {
            setLoading(false);
        }
    }, [celulaId]);

    useEffect(() => {
        void fetch();
    }, [fetch]);

    return { membros: data, loading, erro, refetch: fetch };
}
