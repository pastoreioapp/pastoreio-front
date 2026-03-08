import { useEffect, useRef, useState } from "react";
import { useMembros } from "./useMembros";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";

export function useMembrosSelecionados(
    celulaId: number,
    membroIdInicial?: number | null
) {
    const { membros, loading, erro } = useMembros(celulaId);
    const [membroSelecionado, setMembroSelecionado] = useState<MembroDaCelulaListItemDto | null>(null);
    const hasAppliedInitialSelection = useRef(false);

    useEffect(() => {
        if (loading || hasAppliedInitialSelection.current) {
            return;
        }

        hasAppliedInitialSelection.current = true;

        if (membroIdInicial == null) {
            return;
        }

        const membroInicial = membros.find((membro) => membro.id === membroIdInicial) ?? null;
        setMembroSelecionado(membroInicial);
    }, [loading, membroIdInicial, membros]);

    function toggleMembroSelecionado(membro: MembroDaCelulaListItemDto) {
        setMembroSelecionado((prev) =>
            prev?.id === membro.id ? null : membro
        );
    }

    function deselectMembro() {
        setMembroSelecionado(null);
    }

    return {
        membros,
        membroSelecionado,
        toggleMembroSelecionado,
        deselectMembro,
        loading,
        erro,
    };
}
