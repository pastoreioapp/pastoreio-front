"use client";

import { useEffect, useState } from "react";
import { getTrajetoriaMembro } from "@/app/actions/trajetoria";
import type { TrajetoriaMembroDto } from "@/modules/trajetoria/application/dtos";

export function useTrajetoriaMembro(membroId: number | null | undefined) {
  const [trajetoria, setTrajetoria] = useState<TrajetoriaMembroDto | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (membroId == null) {
      setTrajetoria(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setErro(null);
        const data = await getTrajetoriaMembro(membroId!);
        if (!isMounted) return;
        setTrajetoria(data);
      } catch (error: unknown) {
        if (!isMounted) return;
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar trajetória"
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [membroId]);

  return { trajetoria, loading, erro };
}
