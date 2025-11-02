import { useEffect, useState } from "react";
import { getMembros } from "@/features/membros/membros.service";
import { Membro } from "@/features/membros/types";

export function useMembros() {
    const [membros, setMembros] = useState<Membro[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMembros();
                setMembros(data);
            } catch (error: any) {
                setErro(error.message || "Erro ao carregar membros");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { membros, loading, erro };
}
