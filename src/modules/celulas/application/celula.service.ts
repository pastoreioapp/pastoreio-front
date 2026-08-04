import type { CelulaRepository } from "../infra/celula.repository";
import type { CelulaDetalheDto, CelulaListItemDto } from "./dtos";

export class CelulaService {
  constructor(private readonly repo: CelulaRepository) {}

  async list(): Promise<CelulaListItemDto[]> {
    return this.repo.findAll();
  }

  async get(id: number): Promise<CelulaDetalheDto> {
    return this.repo.findById(id);
  }
}
