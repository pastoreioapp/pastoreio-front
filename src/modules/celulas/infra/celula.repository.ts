import type { SupabaseClient } from "@supabase/supabase-js";
import type { Celula } from "../domain/celula";
import type { CelulaDetalheDto, CelulaListItemDto } from "../application/dtos";
import {
  celulaToInsertPayload,
  rowToCelula,
  rowToCelulaDetalheDto,
  rowToCelulaListItemDto,
} from "./celula.mapper";
import type { CelulaListRow, CelulaRow } from "./celula.types";

const TABLE = "celulas";

function mensagemErroBanco(message: string): string {
  const texto = message.trim();
  if (
    texto.startsWith("<") ||
    /502|503|504|Bad Gateway|Service Unavailable|Gateway Timeout/i.test(texto)
  ) {
    return "Não foi possível conectar ao banco de dados. Tente novamente em instantes.";
  }
  return message;
}

const CELULA_SELECT = `
  id,
  nome,
  ativa,
  rede,
  dia_semana,
  horario,
  local,
  membros_celula (
    id,
    papel_celula,
    deletado,
    data_saida,
    membros ( id, nome, deletado )
  )
`;

export class CelulaRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(): Promise<CelulaListItemDto[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select(CELULA_SELECT)
      .or("deletado.eq.false,ativa.eq.false")
      .order("criado_em", { ascending: false })
      .order("id", { ascending: false });

    if (error) throw new Error(mensagemErroBanco(error.message));

    return ((data ?? []) as unknown as CelulaListRow[]).map(
      rowToCelulaListItemDto,
    );
  }

  async findById(id: number): Promise<CelulaDetalheDto> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select(CELULA_SELECT)
      .eq("id", id)
      .or("deletado.eq.false,ativa.eq.false")
      .maybeSingle();

    if (error) throw new Error(mensagemErroBanco(error.message));
    if (!data) throw new Error("Célula não encontrada");

    return rowToCelulaDetalheDto(data as unknown as CelulaListRow);
  }

  async save(celula: Celula): Promise<Celula> {
    const payload = celulaToInsertPayload(celula);
    const { data, error } = await this.supabase
      .from(TABLE)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(mensagemErroBanco(error.message));
    if (!data) throw new Error("Não foi possível criar a célula");

    return rowToCelula(data as CelulaRow);
  }
}
