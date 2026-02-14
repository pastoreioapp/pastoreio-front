import { useState } from "react";
import { useEncontros } from "./useEncontros";
import type { Encontro } from "@/modules/celulas/domain/encontro";

export function useEncontrosSelecionados() {
    const { encontros, loading, erro, refetch } = useEncontros();
    const [encontrosSelecionado, setEncontrosSelecionado] =
        useState<Encontro | null>(null);

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
