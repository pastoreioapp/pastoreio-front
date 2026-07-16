import type { TrajetoriaRepository } from "../infra/trajetoria.repository";
import type { TrajetoriaDoMembroDto } from "./dtos";
import { toTrajetoriaDoMembroDto } from "./mapper";

export class TrajetoriaService {
  constructor(private readonly repo: TrajetoriaRepository) {}

  async getTrajetoriaDoMembro(membroId: number): Promise<TrajetoriaDoMembroDto | null> {
    const trajetoria = await this.repo.findAtiva();
    if (!trajetoria) return null;

    const [passosDoMembro, passosSoltos] = await Promise.all([
      this.repo.findPassosDoMembro(membroId),
      this.repo.findPassosSoltos(trajetoria.id),
    ]);

    return toTrajetoriaDoMembroDto(trajetoria, passosDoMembro, passosSoltos);
  }

  async getAtiva(): Promise<TrajetoriaDoMembroDto | null> {
    const trajetoria = await this.repo.findAtiva();
    if (!trajetoria) return null;

    return toTrajetoriaDoMembroDto(trajetoria, [], []);
  }

  async registrarPassosConcluidos(
    membroId: number,
    passoIds: unknown[],
  ): Promise<void> {
    const ids = passoIds.filter((id): id is number => typeof id === "number");
    await this.repo.insertPassosConcluidos(membroId, ids);
  }
}
