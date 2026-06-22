"use client";

import { useCallback, useEffect, useState } from "react";
import { getVinculosDoMembro } from "@/app/actions/celulas";
import type { VinculosDoMembroDto } from "@/modules/celulas/application/dtos";

export function useVinculosMembro(membroId: number | null) {
  const [vinculos, setVinculos] = useState<VinculosDoMembroDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (membroId == null) {
      setVinculos(null);
      setLoading(false);
      setErro(null);
      return;
    }

    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setErro(null);
        const data = await getVinculosDoMembro(membroId!);
        if (!isMounted) return;
        setVinculos(data);
      } catch (error: unknown) {
        if (!isMounted) return;
        setErro(error instanceof Error ? error.message : "Erro ao carregar vínculos");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [membroId, fetchTrigger]);

  return { vinculos, loading, erro, refetch };
}
