"use client";

import { useEffect, useState } from "react";
import type { Edge, Node } from "reactflow";
import { buildOrganogramaGraph } from "../lib/buildOrganogramaGraph";
import { mapMembroToOrganogramaPessoa } from "../lib/mapMembroToOrganogramaPessoa";
import { listMembrosDaCelula } from "@/app/actions/celulas";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";

type UseOrganogramaState = {
    nodes: Node[];
    edges: Edge[];
    loading: boolean;
    error: string | null;
    isEmpty: boolean;
};

export function useOrganograma(): UseOrganogramaState {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // TODO: obter celulaId do usuário logado (ex.: contexto, rota /celulas/[id]/organograma ou sessão)
    const celulaId = 3;

    useEffect(() => {
        let isMounted = true;

        async function loadOrganograma() {
            try {
                const membros: MembroDaCelulaListItemDto[] = await listMembrosDaCelula(celulaId);
                const pessoas = membros.map(mapMembroToOrganogramaPessoa);
                const graph = buildOrganogramaGraph(pessoas);

                if (!isMounted) {
                    return;
                }

                setNodes(graph.nodes);
                setEdges(graph.edges);
            } catch (loadError: unknown) {
                if (!isMounted) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Erro ao carregar organograma"
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadOrganograma();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        nodes,
        edges,
        loading,
        error,
        isEmpty: !loading && !error && nodes.length === 0,
    };
}
