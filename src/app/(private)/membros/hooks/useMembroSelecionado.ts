import { useEffect, useState } from "react";
import { useMembros } from "./useMembros";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";

export function useMembrosSelecionados() {
    const { membros, loading, erro } = useMembros();
    const [membroSelecionado, setMembroSelecionado] = useState<MembroListItemDto | null>(null);

    useEffect(() => {
        if (membros.length > 0 && !membroSelecionado) {
            setMembroSelecionado(membros[0]);
        }
    }, [membroSelecionado, membros]);

    function toggleMembroSelecionado(membro: MembroListItemDto) {
        setMembroSelecionado((prev) =>
            prev?.id === membro.id ? null : membro
        );
    }

    return {
        membros,
        membroSelecionado,
        toggleMembroSelecionado,
        loading,
        erro,
    };
}
