import type { InscricaoRepository } from "../infra/inscricao.repository";
import type { CursoDoMembroDto } from "./dtos";
import { toCursoDoMembroDto } from "./mapper";

export class InscricaoService {
  constructor(private readonly repo: InscricaoRepository) {}

  async listCursosDoMembro(membroId: number): Promise<CursoDoMembroDto[]> {
    const rows = await this.repo.findCursosDoMembro(membroId);
    return rows.map(toCursoDoMembroDto);
  }
}
