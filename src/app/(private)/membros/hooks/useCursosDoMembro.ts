"use client";

import { useCallback, useEffect, useState } from "react";
import { getCursosDoMembro } from "@/app/actions/cursos";
import type { CursoDoMembroDto } from "@/modules/cursos/application/dtos";

export function useCursosDoMembro(membroId: number) {
    const [cursos, setCursos] = useState<CursoDoMembroDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    const refetch = useCallback(() => {
        setFetchTrigger((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setErro(null);
                const data = await getCursosDoMembro(membroId);
                if (!isMounted) return;
                setCursos(data);
            } catch (error: unknown) {
                if (!isMounted) return;
                setErro(error instanceof Error ? error.message : "Erro ao carregar cursos");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [membroId, fetchTrigger]);

    return { cursos, loading, erro, refetch };
}
