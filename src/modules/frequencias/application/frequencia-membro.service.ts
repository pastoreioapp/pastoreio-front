import type { FrequenciaMembroRepository } from "../infra/frequencia-membro.repository";
import type { FrequenciaDoMembroDto } from "./dtos";
import {
  toFrequenciasCelula,
  toFrequenciasCurso,
  toAcompanhamentosPastorais,
} from "./mapper";

export class FrequenciaMembroService {
  constructor(private readonly repo: FrequenciaMembroRepository) {}

  async listFrequenciasDoMembro(membroId: number): Promise<FrequenciaDoMembroDto[]> {
    const [celula, curso, pastoral] = await Promise.all([
      this.repo.findFrequenciasCelula(membroId),
      this.repo.findFrequenciasCurso(membroId),
      this.repo.findAcompanhamentosPastorais(membroId),
    ]);

    return [
      ...toFrequenciasCelula(celula),
      ...toFrequenciasCurso(curso),
      ...toAcompanhamentosPastorais(pastoral),
    ].sort((a, b) => a.data.localeCompare(b.data));
  }
}
