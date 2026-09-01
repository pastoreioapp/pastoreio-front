"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCelula,
  listTodosMembrosDaCelula,
} from "@/app/actions/celulas";
import type {
  CelulaDetalheDto,
  MembroDaCelulaListItemDto,
} from "@/modules/celulas/application/dtos";

export function useCelulaDetalhe(celulaId: number | null) {
  const [celula, setCelula] = useState<CelulaDetalheDto | null>(null);
  const [membros, setMembros] = useState<MembroDaCelulaListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  const aplicarEdicaoMembro = useCallback(
    (atualizado: Partial<MembroDaCelulaListItemDto>) => {
      if (atualizado.id == null) return;
      setMembros((atual) =>
        atual.map((membro) =>
          membro.id === atualizado.id ? { ...membro, ...atualizado } : membro,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    if (celulaId == null || !Number.isFinite(celulaId)) {
      setCelula(null);
      setMembros([]);
      setErro("Identificador da célula inválido");
      setLoading(false);
      return;
    }

    const resolvedCelulaId = celulaId;
    let isMounted = true;

    async function fetchData() {
      try {
        if (fetchTrigger === 0) setLoading(true);
        setErro(null);
        const [celulaData, membrosData] = await Promise.all([
          getCelula(resolvedCelulaId),
          listTodosMembrosDaCelula(resolvedCelulaId),
        ]);
        if (!isMounted) return;
        setCelula(celulaData);
        setMembros(membrosData);
      } catch (error: unknown) {
        if (!isMounted) return;
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar detalhes da célula",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [celulaId, fetchTrigger]);

  return { celula, membros, loading, erro, refetch, aplicarEdicaoMembro };
}
