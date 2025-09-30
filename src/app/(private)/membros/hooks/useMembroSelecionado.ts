import { useEffect, useState } from "react";
import { useMembros } from "./useMembros";
import { Membro } from "@/features/membros/types";

export function useMembrosSelecionados() {
    const { membros, loading, erro } = useMembros();
    const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(
        null
    );

    useEffect(() => {
        if (membros.length > 0) {
            setMembroSelecionado(
                membros.find((m) => m.funcao.toLowerCase().includes("líder")) ||
                    membros[0]
            );
        }
    }, [membros]);

    function toggleMembroSelecionado(membro: Membro) {
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
