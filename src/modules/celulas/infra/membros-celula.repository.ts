import type { SupabaseClient } from "@supabase/supabase-js";
import type { MembroDaCelulaListItemDto } from "../application/dtos";
import {
  PapelCelula,
  PAPEIS_CELULA_LIDERANCA,
  parsePapelCelula,
} from "../domain/papel-celula";
import { rowToMembroDaCelulaListItemDto } from "./membros-celula.mapper";

const TABLE = "membros_celula";

export interface MembroCelulaContext {
  celulaId: number;
  papelCelula: PapelCelula;
}

export class MembrosCelulaRepository {
  constructor(private supabase: SupabaseClient) {}

  async findMembrosByCelulaId(
    celulaId: number
  ): Promise<MembroDaCelulaListItemDto[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("id, celula_id, membro_id, papel_celula, data_entrada, deletado, membros(*)")
      .eq("celula_id", celulaId)
      .eq("deletado", false)
      .not("papel_celula", "in", `(${PAPEIS_CELULA_LIDERANCA.join(",")})`)
      .order("papel_celula", { ascending: true });

    if (error) throw error;

    const rows = (data ?? []) as unknown as Parameters<
      typeof rowToMembroDaCelulaListItemDto
    >[0][];
    return rows
      .filter((row) => row.membros && !row.membros.deletado)
      .map(rowToMembroDaCelulaListItemDto);
  }

  async findTodosMembrosAtivosByCelulaId(
    celulaId: number,
  ): Promise<MembroDaCelulaListItemDto[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select(
        "id, celula_id, membro_id, papel_celula, data_entrada, deletado, membros(*)",
      )
      .eq("celula_id", celulaId)
      .eq("deletado", false)
      .is("data_saida", null)
      .order("papel_celula", { ascending: true });

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as unknown as Parameters<
      typeof rowToMembroDaCelulaListItemDto
    >[0][];
    return rows
      .filter((row) => row.membros && !row.membros.deletado)
      .map(rowToMembroDaCelulaListItemDto);
  }

  async findCelulaContextByMembroId(
    membroId: number,
    allowedRoles: readonly PapelCelula[],
  ): Promise<MembroCelulaContext | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("celula_id, papel_celula")
      .eq("membro_id", membroId)
      .eq("deletado", false)
      .is("data_saida", null)
      .in("papel_celula", [...allowedRoles])
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data?.celula_id || !data?.papel_celula) {
      return null;
    }

    const papelCelula = parsePapelCelula(data.papel_celula);
    if (!papelCelula) {
      return null;
    }

    return {
      celulaId: Number(data.celula_id),
      papelCelula,
    };
  }

  async findMembrosByCelulaIdNaData(
    celulaId: number,
    data: string,
  ): Promise<MembroDaCelulaListItemDto[]> {
    const { data: rows, error } = await this.supabase
      .from(TABLE)
      .select("id, celula_id, membro_id, papel_celula, data_entrada, deletado, membros(*)")
      .eq("celula_id", celulaId)
      .eq("deletado", false)
      .or(`data_saida.is.null,data_saida.gte.${data}`)
      .order("papel_celula", { ascending: true });

    if (error) throw new Error(error.message);

    return ((rows ?? []) as unknown as Parameters<typeof rowToMembroDaCelulaListItemDto>[0][])
      .filter((row) => row.membros && !row.membros.deletado)
      .map(rowToMembroDaCelulaListItemDto);
  }

  async findVinculoById(
    vinculoId: number,
  ): Promise<{
    id: number;
    celulaId: number;
    membroId: number;
    papelCelula: PapelCelula | null;
    dataSaida: string | null;
  } | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("id, celula_id, membro_id, papel_celula, data_saida")
      .eq("id", vinculoId)
      .eq("deletado", false)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id: Number(data.id),
      celulaId: Number(data.celula_id),
      membroId: Number(data.membro_id),
      papelCelula: parsePapelCelula(data.papel_celula),
      dataSaida: data.data_saida,
    };
  }

  async desvincular(vinculoId: number, desvinculadoPor: string): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await this.supabase
      .from(TABLE)
      .update({
        data_saida: now.split("T")[0],
        desvinculado_por: desvinculadoPor,
        atualizado_em: now,
        atualizado_por: desvinculadoPor,
      })
      .eq("id", vinculoId);

    if (error) throw new Error(error.message);
  }

  async findMembroIdsLideresAtivos(): Promise<number[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("membro_id, celulas!inner(id)")
      .eq("papel_celula", PapelCelula.LIDER_CELULA)
      .eq("deletado", false)
      .is("data_saida", null)
      .eq("celulas.deletado", false);

    if (error) throw new Error(error.message);

    return [
      ...new Set(
        (data ?? [])
          .map((row) => Number(row.membro_id))
          .filter((id) => Number.isFinite(id) && id > 0),
      ),
    ];
  }

  async existeLiderancaAtiva(
    membroId: number,
    celulaIdExcecao?: number,
  ): Promise<boolean> {
    let query = this.supabase
      .from(TABLE)
      .select("id, celulas!inner(id)")
      .eq("membro_id", membroId)
      .eq("papel_celula", PapelCelula.LIDER_CELULA)
      .eq("deletado", false)
      .is("data_saida", null)
      .eq("celulas.deletado", false);

    if (celulaIdExcecao != null) {
      query = query.neq("celula_id", celulaIdExcecao);
    }

    const { data, error } = await query.limit(1);

    if (error) throw new Error(error.message);
    return (data ?? []).length > 0;
  }

  async atualizarPapel(
    vinculoId: number,
    papel: PapelCelula,
    atualizadoPor: string,
  ): Promise<void> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from(TABLE)
      .update({
        papel_celula: papel,
        atualizado_em: now,
        atualizado_por: atualizadoPor,
      })
      .eq("id", vinculoId)
      .select("id");

    if (error) throw new Error(error.message);
    if (!data?.length) {
      throw new Error(
        "Sem permissão para atualizar o cargo do membro na célula.",
      );
    }
  }

  async vincular(
    celulaId: number,
    membroId: number,
    papel: PapelCelula,
    criadoPor: string,
  ): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await this.supabase.from(TABLE).insert({
      celula_id: celulaId,
      membro_id: membroId,
      papel_celula: papel,
      data_entrada: now.split("T")[0],
      criado_em: now,
      criado_por: criadoPor,
      deletado: false,
    });

    if (error) {
      if (/row-level security/i.test(error.message)) {
        throw new Error(
          "Sem permissão para vincular o líder à célula. Execute a policy de INSERT em membros_celula no Supabase.",
        );
      }
      throw new Error(error.message);
    }
  }
}
