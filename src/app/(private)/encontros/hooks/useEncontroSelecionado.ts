import { useEffect, useState } from "react";
import { useEncontros } from "./useEncontros";
import { Encontro } from "@/features/encontros/types";

export function useEncontrosSelecionados() {
    const { encontros, loading, erro, refetch } = useEncontros();
    const [encontrosSelecionado, setEncontrosSelecionado] =
        useState<Encontro | null>(null);

    useEffect(() => {
        if (encontros.length > 0) {
            setEncontrosSelecionado(encontros[0]);
        }
    }, [encontros]);

    function toggleEncontrosSelecionado(membro: Encontro) {
        setEncontrosSelecionado((prev) =>
            prev?.id === membro.id ? null : membro
        );
    }

    return {
        encontros,
        encontrosSelecionado,
        toggleEncontrosSelecionado,
        loading,
        erro,
        refetch,
    };
}
