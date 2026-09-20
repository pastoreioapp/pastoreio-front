import type { SupabaseClient } from "@supabase/supabase-js";
import type { CursoRow, InscricaoComCursoRow } from "./mapper";

const TABLE = "inscricoes";

export interface InscricaoInsertPayload {
    turma_id: number;
    participante_id: number;
    data_inscricao: string;
    status: string;
    data_conclusao: string | null;
    criado_em: string;
    criado_por: string;
    deletado: boolean;
}

function primeiro<T>(valor: T | T[] | null | undefined): T | null {
    if (valor == null) return null;
    return Array.isArray(valor) ? (valor[0] ?? null) : valor;
}

function mensagemErro(error: { message: string }): Error {
    if (/row-level security/i.test(error.message)) {
        return new Error(
            "Sem permissão para salvar os cursos do membro. Execute a policy de inscricoes no Supabase.",
        );
    }
    if (/column.*status|data_conclusao/i.test(error.message)) {
        return new Error(
            "A tabela inscricoes está sem as colunas de status. Execute a migration de cursos no Supabase.",
        );
    }
    return new Error(error.message);
}

export class InscricaoRepository {
    constructor(private readonly supabase: SupabaseClient) {}

    async findCursosDoMembro(
        membroId: number,
    ): Promise<InscricaoComCursoRow[]> {
        const { data: inscricoes, error } = await this.supabase
            .from(TABLE)
            .select("id, data_inscricao, status, data_conclusao, turma_id")
            .eq("participante_id", membroId)
            .eq("deletado", false);

        if (error) throw mensagemErro(error);

        const linhas = inscricoes ?? [];
        if (linhas.length === 0) return [];

        const turmaIds = [
            ...new Set(
                linhas
                    .map((linha) => Number(linha.turma_id))
                    .filter((id) => Number.isFinite(id) && id > 0),
            ),
        ];

        const { data: turmas, error: erroTurmas } = await this.supabase
            .from("turmas")
            .select(
                "id, nome, data_inicio, data_fim, status, deletado, cursos(id, nome, deletado)",
            )
            .in("id", turmaIds);

        if (erroTurmas) throw mensagemErro(erroTurmas);

        const turmasPorId = new Map(
            (turmas ?? []).map((turma) => [Number(turma.id), turma]),
        );

        return linhas.flatMap((inscricao) => {
            const turma = turmasPorId.get(Number(inscricao.turma_id));
            if (!turma || turma.deletado) return [];

            const curso = primeiro(
                turma.cursos as CursoRow | CursoRow[] | null,
            );
            if (!curso || (curso as CursoRow & { deletado?: boolean }).deletado) {
                return [];
            }

            return [
                {
                    id: Number(inscricao.id),
                    data_inscricao: inscricao.data_inscricao ?? null,
                    status: inscricao.status ?? null,
                    data_conclusao: inscricao.data_conclusao ?? null,
                    turmas: {
                        id: Number(turma.id),
                        nome: String(turma.nome),
                        data_inicio: turma.data_inicio ?? null,
                        data_fim: turma.data_fim ?? null,
                        status: turma.status ?? null,
                        cursos: {
                            id: Number(curso.id),
                            nome: String(curso.nome),
                        },
                    },
                } satisfies InscricaoComCursoRow,
            ];
        });
    }

    async insertMany(payloads: InscricaoInsertPayload[]): Promise<void> {
        if (payloads.length === 0) return;

        const { data, error } = await this.supabase
            .from(TABLE)
            .insert(payloads)
            .select("id");

        if (error) throw mensagemErro(error);
        if (!data?.length) {
            throw new Error(
                "Não foi possível salvar os cursos do membro. Verifique a permissão de INSERT em inscricoes.",
            );
        }
    }

    async update(
        id: number,
        payload: {
            status: string;
            data_conclusao: string | null;
            atualizado_em: string;
            atualizado_por: string;
        },
    ): Promise<void> {
        const { data, error } = await this.supabase
            .from(TABLE)
            .update(payload)
            .eq("id", id)
            .select("id");

        if (error) throw mensagemErro(error);
        if (!data?.length) {
            throw new Error(
                "Não foi possível atualizar o curso do membro. Verifique a permissão de UPDATE em inscricoes.",
            );
        }
    }

    async softDelete(id: number, atualizadoPor: string): Promise<void> {
        const { data, error } = await this.supabase
            .from(TABLE)
            .update({
                deletado: true,
                atualizado_em: new Date().toISOString(),
                atualizado_por: atualizadoPor,
            })
            .eq("id", id)
            .select("id");

        if (error) throw mensagemErro(error);
        if (!data?.length) {
            throw new Error(
                "Não foi possível atualizar o curso do membro. Verifique a permissão de UPDATE em inscricoes.",
            );
        }
    }
}
