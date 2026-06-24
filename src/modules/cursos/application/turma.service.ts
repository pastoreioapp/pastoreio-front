import type { TurmaRepository } from "../infra/turma.repository";
import type { TurmaParaCadastroDto } from "./dtos";
import { toTurmaParaCadastroDto } from "./mapper";

export class TurmaService {
    constructor(private readonly repo: TurmaRepository) {}

    async listAtivosParaCadastro(): Promise<TurmaParaCadastroDto[]> {
        const rows = await this.repo.findAtivasComCursoAtivo();
        return rows.map(toTurmaParaCadastroDto);
    }
}
