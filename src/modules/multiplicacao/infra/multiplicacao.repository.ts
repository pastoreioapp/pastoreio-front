import type { SupabaseClient } from "@supabase/supabase-js";
import type { MultiplicacaoListItemDto } from "../application/dtos";
import { rowToMultiplicacaoListItemDto } from "./multiplicacao.mapper";
import type {
  CreateCelulaPayload,
  CreateMultiplicacaoMembroPayload,
  CreateMultiplicacaoPayload,
  MultiplicacaoRow,
} from "./multiplicacao.types";

const CELULAS_TABLE = "celulas";
const MULTIPLICACAO_TABLE = "multiplicacao";
const MULTIPLICACAO_MEMBROS_TABLE = "multiplicacao_membros";

export class MultiplicacaoRepository {
  constructor(private supabase: SupabaseClient) {}

  async listByCelulaOrigemId(
    celulaOrigemId: number,
  ): Promise<MultiplicacaoListItemDto[]> {
    const { data, error } = await this.supabase
      .from(MULTIPLICACAO_TABLE)
      .select("*")
      .eq("celula_origem_id", celulaOrigemId)
      .eq("deletado", false)
      .order("criado_em", { ascending: false });

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as unknown as MultiplicacaoRow[];
    if (rows.length === 0) {
      return [];
    }

    const multiplicacaoIds = rows.map((row) => row.id);
    const celulaDestinoIds = rows
      .map((row) => row.celula_destino_id)
      .filter((id): id is number => id != null);

    const celulasResult =
      celulaDestinoIds.length > 0
        ? await this.supabase
            .from(CELULAS_TABLE)
            .select("id, nome")
            .in("id", celulaDestinoIds)
        : { data: [], error: null };

    if (celulasResult.error) throw new Error(celulasResult.error.message);

    const { data: membrosRows, error: membrosError } = await this.supabase
      .from(MULTIPLICACAO_MEMBROS_TABLE)
      .select("*")
      .in("multiplicacao_id", multiplicacaoIds)
      .eq("deletado", false);

    if (membrosError) throw new Error(membrosError.message);

    const membrosIds = ((membrosRows ?? []) as { membro_id: number }[]).map(
      (membro) => membro.membro_id,
    );

    const membrosNomesResult =
      membrosIds.length > 0
        ? await this.supabase.from("membros").select("id, nome").in("id", membrosIds)
        : { data: [], error: null };

    if (membrosNomesResult.error) {
      throw new Error(membrosNomesResult.error.message);
    }

    const celulaNomeById = new Map<number, string | null>(
      ((celulasResult.data ?? []) as { id: number; nome: string | null }[]).map(
        (celula) => [Number(celula.id), celula.nome],
      ),
    );

    const nomeByMembroId = new Map<number, string | null>(
      ((membrosNomesResult.data ?? []) as { id: number; nome: string | null }[]).map(
        (membro) => [Number(membro.id), membro.nome],
      ),
    );

    const membrosByMultiplicacaoId = new Map<
      number,
      MultiplicacaoRow["multiplicacao_membros"]
    >();
    for (const membro of (membrosRows ?? []) as unknown as NonNullable<
      MultiplicacaoRow["multiplicacao_membros"]
    >) {
      if (membro.multiplicacao_id == null) {
        continue;
      }

      const list = membrosByMultiplicacaoId.get(membro.multiplicacao_id) ?? [];
      list.push({
        ...membro,
        membros: { nome: nomeByMembroId.get(membro.membro_id) ?? null },
      });
      membrosByMultiplicacaoId.set(membro.multiplicacao_id, list);
    }

    return rows.map((row) =>
      rowToMultiplicacaoListItemDto({
        ...row,
        celula_destino:
          row.celula_destino_id != null
            ? { nome: celulaNomeById.get(row.celula_destino_id) ?? null }
            : null,
        multiplicacao_membros: membrosByMultiplicacaoId.get(row.id) ?? [],
      }),
    );
  }

  async createCelula(payload: CreateCelulaPayload): Promise<number> {
    const { data, error } = await this.supabase
      .from(CELULAS_TABLE)
      .insert(payload)
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    if (!data?.id) throw new Error("Celula destino nao foi criada.");

    return Number(data.id);
  }

  async createMultiplicacao(
    payload: CreateMultiplicacaoPayload,
  ): Promise<number> {
    const { data, error } = await this.supabase
      .from(MULTIPLICACAO_TABLE)
      .insert(payload)
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    if (!data?.id) throw new Error("Multiplicacao nao foi criada.");

    return Number(data.id);
  }

  async createMultiplicacaoMembros(
    payload: CreateMultiplicacaoMembroPayload[],
  ): Promise<void> {
    if (payload.length === 0) {
      return;
    }

    const { error } = await this.supabase
      .from(MULTIPLICACAO_MEMBROS_TABLE)
      .insert(payload);

    if (error) throw new Error(error.message);
  }

  async findDestinoByIdAndCelulaOrigemId(
    multiplicacaoId: number,
    celulaOrigemId: number,
  ): Promise<{ id: number; celulaDestinoId: number | null } | null> {
    const { data, error } = await this.supabase
      .from(MULTIPLICACAO_TABLE)
      .select("id, celula_destino_id")
      .eq("id", multiplicacaoId)
      .eq("celula_origem_id", celulaOrigemId)
      .eq("deletado", false)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      id: Number(data.id),
      celulaDestinoId:
        data.celula_destino_id == null ? null : Number(data.celula_destino_id),
    };
  }

  async softDeleteMultiplicacaoMembros(
    multiplicacaoId: number,
    auditUserId: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from(MULTIPLICACAO_MEMBROS_TABLE)
      .update({
        deletado: true,
        atualizado_em: new Date().toISOString(),
        atualizado_por: auditUserId,
      })
      .eq("multiplicacao_id", multiplicacaoId)
      .eq("deletado", false);

    if (error) throw new Error(error.message);
  }

  async softDeleteMultiplicacao(
    multiplicacaoId: number,
    celulaOrigemId: number,
    auditUserId: string,
  ): Promise<void> {
    const { data, error } = await this.supabase
      .from(MULTIPLICACAO_TABLE)
      .update({
        deletado: true,
        atualizado_em: new Date().toISOString(),
        atualizado_por: auditUserId,
      })
      .eq("id", multiplicacaoId)
      .eq("celula_origem_id", celulaOrigemId)
      .eq("deletado", false)
      .select("id");

    if (error) throw new Error(error.message);
    if (!data?.length) {
      throw new Error("Multiplicacao nao encontrada para esta celula.");
    }
  }

  async softDeleteCelula(
    celulaId: number,
    auditUserId: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from(CELULAS_TABLE)
      .update({
        deletado: true,
        ativa: false,
        atualizado_em: new Date().toISOString(),
        atualizado_por: auditUserId,
      })
      .eq("id", celulaId)
      .eq("deletado", false);

    if (error) throw new Error(error.message);
  }
}
