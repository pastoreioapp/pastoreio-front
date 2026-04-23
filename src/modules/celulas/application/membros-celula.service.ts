import type { MembroDaCelulaListItemDto } from "./dtos";
import type { MembrosCelulaRepository } from "../infra/membros-celula.repository";

export class MembrosCelulaService {
  constructor(private repo: MembrosCelulaRepository) {}

  async listMembros(celulaId: number): Promise<MembroDaCelulaListItemDto[]> {
    return this.repo.findMembrosByCelulaId(celulaId);
  }

  async listMembrosNaData(celulaId: number, data: string): Promise<MembroDaCelulaListItemDto[]> {
    return this.repo.findMembrosByCelulaIdNaData(celulaId, data);
  }

  async desvincular(vinculoId: number, desvinculadoPor: string): Promise<void> {
    const vinculo = await this.repo.findVinculoById(vinculoId);
    if (!vinculo) throw new Error("Vínculo não encontrado.");
    if (vinculo.dataSaida) throw new Error("Este membro já foi desvinculado desta célula.");
    await this.repo.desvincular(vinculoId, desvinculadoPor);
  }
}
