import { useState } from "react";
import { useMembros } from "./useMembros";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";

export function useMembrosSelecionados() {
    const { membros, loading, erro } = useMembros();
    const [membroSelecionado, setMembroSelecionado] = useState<MembroListItemDto | null>(null);

    function toggleMembroSelecionado(membro: MembroListItemDto) {
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
