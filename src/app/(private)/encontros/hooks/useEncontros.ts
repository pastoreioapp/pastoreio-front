import { useEffect, useState } from "react";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import { EncontroService } from "@/modules/celulas/application/encontro.service";
import { EncontroRepository } from "@/modules/celulas/infra/encontro.repository";

export function useEncontros() {
  const [encontros, setEncontros] = useState<Encontro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const repo = new EncontroRepository();
        const service = new EncontroService(repo);
        const data = await service.list();
        setEncontros(data);
      } catch (error: unknown) {
        setErro(
          error instanceof Error ? error.message : "Erro ao carregar encontros"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { encontros, loading, erro };
}
