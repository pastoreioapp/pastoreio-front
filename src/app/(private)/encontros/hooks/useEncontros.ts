import { useCallback, useEffect, useState } from "react";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import { EncontroService } from "@/modules/celulas/application/encontro.service";
import { EncontroRepository } from "@/modules/celulas/infra/encontro.repository";

const CELULA_NAO_VINCULADA_MESSAGE =
  "Nenhuma célula vinculada foi encontrada para o usuário logado.";

export function useEncontros(celulaId?: number | null) {
  const [encontros, setEncontros] = useState<Encontro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // TODO: investiar pq foi necessário separar refetch do useFfect rodado ao montar o componente
  // Comportamento anterior: a tela de encontros não era carregada
  const refetch = useCallback(async () => {
    if (celulaId == null) {
      setEncontros([]);
      setErro(CELULA_NAO_VINCULADA_MESSAGE);
      setLoading(false);
      return;
    }

    const resolvedCelulaId = celulaId;
    try {
      setLoading(true);
      setErro(null);
      const repo = new EncontroRepository();
      const service = new EncontroService(repo);
      const data = await service.list(resolvedCelulaId);
      setEncontros(data);
    } catch (error: unknown) {
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar encontros"
      );
    } finally {
      setLoading(false);
    }
  }, [celulaId]);

  useEffect(() => {
    if (celulaId == null) {
      setEncontros([]);
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
        const repo = new EncontroRepository();
        const service = new EncontroService(repo);
        const data = await service.list(resolvedCelulaId);
        if (!isMounted) {
          return;
        }

        setEncontros(data);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErro(
          error instanceof Error ? error.message : "Erro ao carregar encontros"
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
  }, [celulaId]);

  return { encontros, loading, erro, refetch };
}
