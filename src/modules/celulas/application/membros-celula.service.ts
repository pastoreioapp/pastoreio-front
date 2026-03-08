import type { MembroDaCelulaListItemDto } from "./dtos";
import type { MembrosCelulaRepository } from "../infra/membros-celula.repository";

export class MembrosCelulaService {
  constructor(private repo: MembrosCelulaRepository) {}

  async listMembros(celulaId: number): Promise<MembroDaCelulaListItemDto[]> {
    return this.repo.findMembrosByCelulaId(celulaId);
  }
}
