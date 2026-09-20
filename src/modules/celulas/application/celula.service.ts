import type { Celula } from "../domain/celula";
import { isDiaSemana } from "../domain/dia-semana";
import { PapelCelula } from "../domain/papel-celula";
import { isRedeCelula } from "../domain/rede-celula";
import type { CelulaRepository } from "../infra/celula.repository";
import type {
  CelulaDetalheDto,
  CelulaListItemDto,
  CreateCelulaDto,
} from "./dtos";
import type { MembrosCelulaService } from "./membros-celula.service";

function textoOpcional(valor: string | null | undefined): string | null {
  const texto = valor?.trim() ?? "";
  return texto === "" ? null : texto;
}

export class CelulaService {
  constructor(
    private readonly repo: CelulaRepository,
    private readonly membrosCelulaService: MembrosCelulaService,
  ) {}

  async list(): Promise<CelulaListItemDto[]> {
    return this.repo.findAll();
  }

  async get(id: number): Promise<CelulaDetalheDto> {
    return this.repo.findById(id);
  }

  async create(dto: CreateCelulaDto, criadoPor: string): Promise<Celula> {
    const nome = dto.nome.trim();
    if (!nome) {
      throw new Error("Informe o nome da célula.");
    }

    if (!isRedeCelula(dto.rede)) {
      throw new Error("Informe a rede da célula.");
    }

    const diaSemana = textoOpcional(dto.diaSemana);
    if (diaSemana != null && !isDiaSemana(diaSemana)) {
      throw new Error("Dia da semana inválido.");
    }

    const liderMembroId = dto.liderMembroId ?? null;
    if (
      liderMembroId != null &&
      (!Number.isFinite(liderMembroId) || liderMembroId <= 0)
    ) {
      throw new Error("Líder inválido.");
    }

    if (liderMembroId != null) {
      await this.membrosCelulaService.assertNaoELiderAtivo(liderMembroId);
    }

    const now = new Date().toISOString();
    const celula = await this.repo.save({
      id: 0,
      grupoId: null,
      nome,
      rede: dto.rede,
      diaSemana,
      horario: textoOpcional(dto.horario),
      local: textoOpcional(dto.local),
      ativa: dto.ativa ?? true,
      criadoEm: now,
      criadoPor,
      atualizadoEm: null,
      atualizadoPor: null,
      deletado: false,
    });

    if (liderMembroId != null) {
      await this.membrosCelulaService.vincularMembro(
        celula.id,
        liderMembroId,
        PapelCelula.LIDER_CELULA,
        criadoPor,
      );
    }

    return celula;
  }
}
