"use client";

import { useEffect, useState } from "react";
import { listMembrosDaCelula } from "@/app/actions/celulas";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";

export function useMembros(celulaId: number) {
    const [membros, setMembros] = useState<MembroListItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await listMembrosDaCelula(celulaId);
                setMembros(data);
            } catch (error: unknown) {
                setErro(error instanceof Error ? error.message : "Erro ao carregar membros");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [celulaId]);

    return { membros, loading, erro };
}
