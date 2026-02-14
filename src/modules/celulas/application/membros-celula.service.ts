import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";
import { MembrosCelulaRepository } from "../infra/membros-celula.repository";

export class MembrosCelulaService {
  constructor(private repo: MembrosCelulaRepository) {}

  async listMembros(celulaId: number): Promise<MembroListItemDto[]> {
    return this.repo.findMembrosByCelulaId(celulaId);
  }
}
