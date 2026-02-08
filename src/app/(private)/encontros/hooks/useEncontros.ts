import { getEncontros } from "@/features/encontros/encontros.service";
import { Encontro } from "@/features/encontros/types";
import { useEffect, useState, useCallback } from "react";

export function useEncontros() {
    const [encontros, setEncontros] = useState<Encontro[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getEncontros();
            setEncontros(data);
            setErro(null);
        } catch (error: any) {
            setErro(error.message || "Erro ao carregar encontros");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { encontros, loading, erro, refetch: fetchData };
}
