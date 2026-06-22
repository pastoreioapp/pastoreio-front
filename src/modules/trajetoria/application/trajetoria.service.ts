import type { TrajetoriaRepository } from "../infra/trajetoria.repository";
import type { HistoricoAvancosRepository } from "../infra/historico-avancos.repository";
import type { TrajetoriaDoMembroDto } from "./dtos";
import { TipoAvanco } from "../domain/tipo-avanco";
import { toTrajetoriaDoMembroDto } from "./mapper";

export class TrajetoriaService {
  constructor(
    private readonly repo: TrajetoriaRepository,
    private readonly historicoRepo: HistoricoAvancosRepository,
  ) {}

  async getTrajetoriaDoMembro(membroId: number): Promise<TrajetoriaDoMembroDto | null> {
    const trajetoria = await this.repo.findAtiva();
    if (!trajetoria) return null;

    const [passosDoMembro, passosSoltos] = await Promise.all([
      this.repo.findPassosDoMembro(membroId),
      this.repo.findPassosSoltos(trajetoria.id),
    ]);

    return toTrajetoriaDoMembroDto(trajetoria, passosDoMembro, passosSoltos);
  }

  async registrarPassoConcluido(
    membroId: number,
    passoId: number,
    registradoPor: string,
  ): Promise<void> {
    const passosDoMembro = await this.repo.findPassosDoMembro(membroId);
    const jaConcluido = passosDoMembro.some(
      (p) => p.passoId === passoId && p.dataConclusao != null,
    );
    if (jaConcluido) throw new Error("Este passo já foi concluído.");

    await this.repo.upsertPassoConcluido(membroId, passoId, registradoPor);
    await this.historicoRepo.registrar(
      membroId,
      TipoAvanco.PASSO,
      passoId,
      registradoPor,
    );
  }
}
