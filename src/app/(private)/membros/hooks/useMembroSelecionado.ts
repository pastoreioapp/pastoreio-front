import { useEffect, useRef, useState } from "react";
import { useMembros } from "./useMembros";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";

export function useMembrosSelecionados(
    celulaId?: number | null,
    membroIdInicial?: number | null,
) {
    const { membros, loading, erro, refetch, aplicarEdicaoMembro } =
        useMembros(celulaId);
    const membrosVisiveis = membros;
    const [membroSelecionado, setMembroSelecionado] =
        useState<MembroDaCelulaListItemDto | null>(null);
    const hasAppliedInitialSelection = useRef(false);

    useEffect(() => {
        hasAppliedInitialSelection.current = false;
        setMembroSelecionado(null);
    }, [celulaId, membroIdInicial]);

    useEffect(() => {
        if (loading || hasAppliedInitialSelection.current) {
            return;
        }

        hasAppliedInitialSelection.current = true;

        if (membroIdInicial == null) {
            return;
        }

        const membroInicial =
            membrosVisiveis.find((membro) => membro.id === membroIdInicial) ??
            null;
        setMembroSelecionado(membroInicial);
    }, [loading, membroIdInicial, membrosVisiveis]);

    useEffect(() => {
        if (
            membroSelecionado &&
            !membrosVisiveis.some(
                (membro) => membro.id === membroSelecionado.id,
            )
        ) {
            setMembroSelecionado(null);
        }
    }, [membroSelecionado, membrosVisiveis]);

    function toggleMembroSelecionado(membro: MembroDaCelulaListItemDto) {
        setMembroSelecionado((prev) =>
            prev?.id === membro.id ? null : membro,
        );
    }

    function deselectMembro() {
        setMembroSelecionado(null);
    }

    function aplicarEdicao(atualizado: Partial<MembroDaCelulaListItemDto>) {
        aplicarEdicaoMembro(atualizado);
        if (atualizado.id != null && membroSelecionado?.id === atualizado.id) {
            setMembroSelecionado((atual) =>
                atual ? { ...atual, ...atualizado } : atual,
            );
        }
    }

    return {
        membros: membrosVisiveis,
        membroSelecionado,
        toggleMembroSelecionado,
        deselectMembro,
        refetch,
        aplicarEdicao,
        loading,
        erro,
    };
}
