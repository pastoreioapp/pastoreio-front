import { useEffect, useMemo, useRef, useState } from "react";
import { useMembros } from "./useMembros";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import { PapelCelula } from "@/modules/celulas/domain/papel-celula";

export function useMembrosSelecionados(
    celulaId?: number | null,
    membroIdInicial?: number | null
) {
    const { membros, loading, erro, refetch } = useMembros(celulaId);
    const membrosVisiveis = useMemo(
        () => membros.filter((membro) => membro.funcao !== PapelCelula.LIDER_CELULA),
        [membros]
    );
    const [membroSelecionado, setMembroSelecionado] = useState<MembroDaCelulaListItemDto | null>(null);
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

        const membroInicial = membrosVisiveis.find((membro) => membro.id === membroIdInicial) ?? null;
        setMembroSelecionado(membroInicial);
    }, [loading, membroIdInicial, membrosVisiveis]);

    useEffect(() => {
        if (membroSelecionado && !membrosVisiveis.some((membro) => membro.id === membroSelecionado.id)) {
            setMembroSelecionado(null);
        }
    }, [membroSelecionado, membrosVisiveis]);

    function toggleMembroSelecionado(membro: MembroDaCelulaListItemDto) {
        setMembroSelecionado((prev) =>
            prev?.id === membro.id ? null : membro
        );
    }

    function deselectMembro() {
        setMembroSelecionado(null);
    }

    return {
        membros: membrosVisiveis,
        membroSelecionado,
        toggleMembroSelecionado,
        deselectMembro,
        refetch,
        loading,
        erro,
    };
}
