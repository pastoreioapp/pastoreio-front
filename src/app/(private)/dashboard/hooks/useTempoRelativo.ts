"use client";

import { useEffect, useState } from "react";

function formatarTempoRelativo(data: Date): string {
    const diffMs = Date.now() - data.getTime();
    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHoras = Math.floor(diffMin / 60);

    if (diffSeg < 60) return "Atualizado agora";
    if (diffMin === 1) return "Atualizado há 1 min";
    if (diffMin < 60) return `Atualizado há ${diffMin} min`;
    if (diffHoras === 1) return "Atualizado há 1 h";
    return `Atualizado há ${diffHoras} h`;
}

export function useTempoRelativo(data: Date | null) {
    const [texto, setTexto] = useState(() =>
        data ? formatarTempoRelativo(data) : "Atualizado há poucos minutos",
    );

    useEffect(() => {
        if (!data) return;

        setTexto(formatarTempoRelativo(data));

        const interval = setInterval(() => {
            setTexto(formatarTempoRelativo(data));
        }, 60_000);

        return () => clearInterval(interval);
    }, [data]);

    return texto;
}
