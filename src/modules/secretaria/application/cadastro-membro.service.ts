import type { Membro } from "../domain/membro";
import type { CreateMembroDto } from "./dtos";
import type { MembroService } from "./membro.service";
import type { MembrosCelulaService } from "@/modules/celulas/application/membros-celula.service";
import type { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import type { TrajetoriaService } from "@/modules/trajetoria/application/trajetoria.service";
import type { InscricaoService } from "@/modules/cursos/application/inscricao.service";
import type { InscricaoCadastroDto } from "@/modules/cursos/application/dtos";

interface CadastroMembroPayload {
    dadosPessoais: {
        nome: string;
        nascimento: string | null;
        email: string;
        telefone: string;
        endereco: string;
        cargo: PapelCelula;
        ministerio: string;
        discipulador: string;
        discipulo: string;
        estadoCivil: string;
        conjuge: string;
        filhos: string;
    };
    cursos?: InscricaoCadastroDto[];
    trajetoria?: number[];
    vinculoId?: number;
}

export class CadastroMembroService {
    constructor(
        private readonly membroService: MembroService,
        private readonly membrosCelulaService: MembrosCelulaService,
        private readonly trajetoriaService: TrajetoriaService,
        private readonly inscricaoService: InscricaoService,
    ) { }

    async createFromUI(
        payload: CadastroMembroPayload,
        celulaId: number | undefined,
        criadoPor: string,
    ): Promise<Membro> {
        const { dadosPessoais, cursos, trajetoria } = payload;

        const dto: CreateMembroDto = {
            userId: null,
            nome: dadosPessoais.nome,
            email: dadosPessoais.email,
            telefone: dadosPessoais.telefone,
            dataNascimento: dadosPessoais.nascimento,
            endereco: dadosPessoais.endereco,
            estadoCivil: dadosPessoais.estadoCivil,
            conjuge: dadosPessoais.conjuge || null,
            filhos: dadosPessoais.filhos,
            discipulador: dadosPessoais.discipulador,
            discipulando: dadosPessoais.discipulo,
            ministerio: dadosPessoais.ministerio,
            ativo: true,
        };

        const membro = await this.membroService.create(dto, criadoPor);

        if (celulaId) {
            await this.membrosCelulaService.vincularMembro(
                celulaId,
                membro.id,
                dadosPessoais.cargo,
                criadoPor,
            );
        }

        if (trajetoria && Array.isArray(trajetoria) && trajetoria.length > 0) {
            await this.trajetoriaService.registrarPassosConcluidos(
                membro.id,
                trajetoria,
            );
        }

        if (cursos && Array.isArray(cursos) && cursos.length > 0) {
            await this.inscricaoService.createFromCadastro(
                membro.id,
                cursos,
                criadoPor,
            );
        }

        return membro;
    }

    async updateFromUI(
        membroId: number,
        payload: CadastroMembroPayload,
        atualizadoPor: string,
    ): Promise<void> {
        const { dadosPessoais, cursos, trajetoria, vinculoId } = payload;

        await this.membroService.update(
            membroId,
            {
                nome: dadosPessoais.nome,
                email: dadosPessoais.email,
                telefone: dadosPessoais.telefone,
                dataNascimento: dadosPessoais.nascimento,
                endereco: dadosPessoais.endereco,
                estadoCivil: dadosPessoais.estadoCivil,
                conjuge: dadosPessoais.conjuge || null,
                filhos: dadosPessoais.filhos,
                discipulador: dadosPessoais.discipulador,
                discipulando: dadosPessoais.discipulo,
                ministerio: dadosPessoais.ministerio,
            },
            atualizadoPor,
        );

        if (vinculoId != null && dadosPessoais.cargo) {
            await this.membrosCelulaService.atualizarPapel(
                vinculoId,
                dadosPessoais.cargo,
                atualizadoPor,
            );
        }

        if (Array.isArray(trajetoria)) {
            await this.trajetoriaService.syncPassosConcluidos(
                membroId,
                trajetoria,
            );
        }

        if (Array.isArray(cursos)) {
            await this.inscricaoService.syncFromCadastro(
                membroId,
                cursos,
                atualizadoPor,
            );
        }
    }
}