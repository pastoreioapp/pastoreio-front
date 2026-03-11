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

const CELULA_NAO_VINCULADA_MESSAGE =
    "Nenhuma célula vinculada foi encontrada para o usuário logado.";

export function useOrganograma(
    columnsPerLine: number,
    celulaId?: number | null,
): UseOrganogramaState {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (celulaId == null) {
            setNodes([]);
            setEdges([]);
            setError(CELULA_NAO_VINCULADA_MESSAGE);
            setLoading(false);
            return;
        }

        const resolvedCelulaId = celulaId;
        let isMounted = true;

        async function loadOrganograma() {
            try {
                setLoading(true);
                setError(null);
                const membros: MembroDaCelulaListItemDto[] = await listMembrosDaCelula(resolvedCelulaId);
                const pessoas = membros.map(mapMembroToOrganogramaPessoa);
                const graph = buildOrganogramaGraph(pessoas, columnsPerLine);

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
    }, [celulaId, columnsPerLine]);

    return {
        nodes,
        edges,
        loading,
        error,
        isEmpty: !loading && !error && nodes.length === 0,
    };
}
