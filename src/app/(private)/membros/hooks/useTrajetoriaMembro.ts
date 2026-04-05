"use client";

import { useEffect, useState } from "react";
import { getTrajetoriaDoMembro } from "@/app/actions/trajetoria";
import type { TrajetoriaDoMembroDto } from "@/modules/trajetoria/application/dtos";

export function useTrajetoriaMembro(membroId: number) {
    const [trajetoria, setTrajetoria] = useState<TrajetoriaDoMembroDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setErro(null);
                const data = await getTrajetoriaDoMembro(membroId);
                if (!isMounted) return;
                setTrajetoria(data);
            } catch (error: unknown) {
                if (!isMounted) return;
                setErro(error instanceof Error ? error.message : "Erro ao carregar trajetória");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();

        return () => {
            // Evita race condition ao trocar de membro com requisição em andamento
            isMounted = false;
        };
    }, [membroId]);

    return { trajetoria, loading, erro };
}
