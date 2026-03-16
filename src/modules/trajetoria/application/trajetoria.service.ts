import type { TrajetoriaRepository } from "../infra/trajetoria.repository";
import type { TrajetoriaMembroDto } from "./dtos";
import { toGrupoTrajetoriaDto } from "./mapper";

export class TrajetoriaService {
  constructor(private repo: TrajetoriaRepository) {}

  async getTrajetoriaComProgressoDoMembro(
    membroId: number
  ): Promise<TrajetoriaMembroDto | null> {
    const trajetoria = await this.repo.findTrajetoriaAtiva();
    if (!trajetoria) return null;

    const grupos = await this.repo.findGruposComProgressoDoMembro(
      trajetoria.id,
      membroId
    );

    return {
      trajetoriaId: trajetoria.id,
      trajetoriaNome: trajetoria.nome,
      grupos: grupos.map(toGrupoTrajetoriaDto),
    };
  }
}
