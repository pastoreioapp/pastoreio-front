import { useState } from "react";
import { useMembros } from "./useMembros";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";

export function useMembrosSelecionados(celulaId: number) {
    const { membros, loading, erro } = useMembros(celulaId);
    const [membroSelecionado, setMembroSelecionado] = useState<MembroDaCelulaListItemDto | null>(null);

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
