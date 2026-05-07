"use client";

import { useCallback, useEffect, useState } from "react";
import type { MetaCelulaDto } from "@/modules/metas/application/dtos";
import { getMetasCelula } from "@/app/actions/dashboard";

export function useMetasCelula(celulaId: number | null | undefined) {
    const [data, setData] = useState<MetaCelulaDto[]>([]);
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
            const result = await getMetasCelula(celulaId);
            setData(result);
        } catch (error: unknown) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar metas da célula");
        } finally {
            setLoading(false);
        }
    }, [celulaId]);

    useEffect(() => {
        void fetch();
    }, [fetch]);

    return { metas: data, loading, erro, refetch: fetch };
}
