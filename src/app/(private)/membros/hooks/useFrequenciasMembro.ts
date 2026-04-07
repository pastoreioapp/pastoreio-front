"use client";

import { useEffect, useState } from "react";
import { getFrequenciasDoMembro } from "@/app/actions/frequencias";
import type { FrequenciaDoMembroDto } from "@/modules/frequencias/application/dtos";

export function useFrequenciasMembro(membroId: number) {
    const [frequencias, setFrequencias] = useState<FrequenciaDoMembroDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setErro(null);
                const data = await getFrequenciasDoMembro(membroId);
                if (!isMounted) return;
                setFrequencias(data);
            } catch (error: unknown) {
                if (!isMounted) return;
                setErro(error instanceof Error ? error.message : "Erro ao carregar frequências");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [membroId]);

    return { frequencias, loading, erro };
}
