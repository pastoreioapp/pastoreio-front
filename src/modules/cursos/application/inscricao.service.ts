import type { InscricaoRepository } from "../infra/inscricao.repository";
import type { HistoricoAvancosRepository } from "@/modules/trajetoria/infra/historico-avancos.repository";
import { TipoAvanco } from "@/modules/trajetoria/domain/tipo-avanco";
import type { CursoDoMembroDto } from "./dtos";
import { toCursoDoMembroDto } from "./mapper";

export class InscricaoService {
  constructor(
    private readonly repo: InscricaoRepository,
    private readonly historicoRepo: HistoricoAvancosRepository,
  ) {}

  async listCursosDoMembro(membroId: number): Promise<CursoDoMembroDto[]> {
    const rows = await this.repo.findCursosDoMembro(membroId);
    return rows.map(toCursoDoMembroDto);
  }

  async registrarInscricaoConcluida(
    inscricaoId: number,
    registradoPor: string,
  ): Promise<void> {
    const inscricao = await this.repo.findById(inscricaoId);
    if (!inscricao) throw new Error("Inscrição não encontrada.");
    if (inscricao.concluidoEm) throw new Error("Esta inscrição já foi concluída.");

    await this.repo.marcarConcluida(inscricaoId, registradoPor);
    await this.historicoRepo.registrar(
      inscricao.participanteId,
      TipoAvanco.INSCRICAO_EMP,
      inscricaoId,
      registradoPor,
    );
  }
}
