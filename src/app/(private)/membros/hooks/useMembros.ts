"use client";

import { useEffect, useState } from "react";
import { listMembrosDaCelula } from "@/app/actions/celulas";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";

const CELULA_NAO_VINCULADA_MESSAGE =
    "Nenhuma célula vinculada foi encontrada para o usuário logado.";

export function useMembros(celulaId?: number | null) {
    const [membros, setMembros] = useState<MembroDaCelulaListItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (celulaId == null) {
            setMembros([]);
            setErro(CELULA_NAO_VINCULADA_MESSAGE);
            setLoading(false);
            return;
        }

        const resolvedCelulaId = celulaId;
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setErro(null);
                const data = await listMembrosDaCelula(resolvedCelulaId);
                if (!isMounted) {
                    return;
                }

                setMembros(data);
            } catch (error: unknown) {
                if (!isMounted) {
                    return;
                }

                setErro(error instanceof Error ? error.message : "Erro ao carregar membros");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        fetchData();

        return () => {
            isMounted = false;
        };
    }, [celulaId]);

    return { membros, loading, erro };
}
