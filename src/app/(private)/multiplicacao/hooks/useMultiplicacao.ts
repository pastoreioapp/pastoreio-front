"use client";

import { useCallback, useEffect, useState } from "react";
import { listMembrosDaCelula } from "@/app/actions/celulas";
import { listMultiplicacoesDaCelula } from "@/app/actions/multiplicacao";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { MultiplicacaoListItemDto } from "@/modules/multiplicacao/application/dtos";

const CELULA_NAO_VINCULADA_MESSAGE =
  "Nenhuma celula vinculada foi encontrada para o usuario logado.";

export function useMultiplicacao(celulaId?: number | null) {
  const [membros, setMembros] = useState<MembroDaCelulaListItemDto[]>([]);
  const [multiplicacoes, setMultiplicacoes] = useState<
    MultiplicacaoListItemDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (celulaId == null) {
      setMembros([]);
      setMultiplicacoes([]);
      setErro(CELULA_NAO_VINCULADA_MESSAGE);
      setLoading(false);
      return;
    }

    const resolvedCelulaId = celulaId;
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setErro(null);
        const membrosData = await listMembrosDaCelula(resolvedCelulaId);
        let multiplicacoesData: MultiplicacaoListItemDto[] = [];
        try {
          multiplicacoesData = await listMultiplicacoesDaCelula(resolvedCelulaId);
        } catch {
          multiplicacoesData = [];
        }

        if (!isMounted) {
          return;
        }

        setMembros(membrosData);
        setMultiplicacoes(multiplicacoesData);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar multiplicacao.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [celulaId, fetchTrigger]);

  return { membros, multiplicacoes, loading, erro, refetch };
}
