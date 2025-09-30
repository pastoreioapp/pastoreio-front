import { getEncontros } from "@/features/encontros/encontros.service";
import { Encontro } from "@/features/encontros/types";
import { useEffect, useState } from "react";

export function useEncontros() {
    const [encontros, setEncontros] = useState<Encontro[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getEncontros();
                setEncontros(data);
            } catch (error: any) {
                setErro(error.message || "Erro ao carregar encontros");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { encontros, loading, erro };
}
