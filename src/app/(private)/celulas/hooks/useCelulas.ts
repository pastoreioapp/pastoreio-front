"use client";

import { useCallback, useEffect, useState } from "react";
import { createCelula, listCelulas } from "@/app/actions/celulas";
import type {
  CelulaListItemDto,
  CreateCelulaDto,
} from "@/modules/celulas/application/dtos";

export function useCelulas() {
  const [celulas, setCelulas] = useState<CelulaListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        if (fetchTrigger === 0) setLoading(true);
        setErro(null);
        const data = await listCelulas();
        if (!isMounted) return;
        setCelulas(data);
      } catch (error: unknown) {
        if (!isMounted) return;
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar células",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchTrigger]);

  const criarCelula = useCallback(
    async (dto: CreateCelulaDto) => {
      await createCelula(dto);
      refetch();
    },
    [refetch],
  );

  return { celulas, loading, erro, refetch, criarCelula };
}
