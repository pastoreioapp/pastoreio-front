import { useCallback, useEffect, useState } from "react";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import { listEncontros } from "@/app/actions/encontros";

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
      const data = await listEncontros(resolvedCelulaId);
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
    void refetch();
  }, [refetch]);

  return { encontros, loading, erro, refetch };
}
