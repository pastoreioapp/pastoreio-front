"use client";

import { useEffect, useState } from "react";
import { listMembros } from "@/app/actions/membros";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";

export function useMembros() {
    const [membros, setMembros] = useState<MembroListItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await listMembros();
                setMembros(data);
            } catch (error: unknown) {
                setErro(error instanceof Error ? error.message : "Erro ao carregar membros");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { membros, loading, erro };
}
