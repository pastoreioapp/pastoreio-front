import { useEffect, useState } from "react";
import { useEncontros } from "./useEncontros";
import type { Encontro } from "@/modules/celulas/domain/encontro";

export function useEncontrosSelecionados(celulaId?: number | null) {
    const { encontros, loading, erro, refetch } = useEncontros(celulaId);
    const [encontrosSelecionado, setEncontrosSelecionado] =
        useState<Encontro | null>(null);

    useEffect(() => {
        setEncontrosSelecionado(null);
    }, [celulaId]);

    function toggleEncontrosSelecionado(encontro: Encontro) {
        setEncontrosSelecionado((prev) =>
            prev?.id === encontro.id ? null : encontro
        );
    }

    function deselectEncontro() {
        setEncontrosSelecionado(null);
    }

    return {
        encontros,
        encontrosSelecionado,
        toggleEncontrosSelecionado,
        deselectEncontro,
        loading,
        erro,
        refetch,
    };
}
