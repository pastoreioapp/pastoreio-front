import type { TrajetoriaRepository } from "../infra/trajetoria.repository";
import type { TrajetoriaDoMembroDto } from "./dtos";
import { toTrajetoriaDoMembroDto } from "./mapper";

export class TrajetoriaService {
  constructor(private readonly repo: TrajetoriaRepository) {}

  async getTrajetoriaDoMembro(membroId: number): Promise<TrajetoriaDoMembroDto | null> {
    const trajetoria = await this.repo.findAtiva();
    if (!trajetoria) return null;

    const passosDoMembro = await this.repo.findPassosDoMembro(membroId);
    return toTrajetoriaDoMembroDto(trajetoria, passosDoMembro);
  }
}
