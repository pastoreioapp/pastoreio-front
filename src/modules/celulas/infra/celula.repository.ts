import type { SupabaseClient } from "@supabase/supabase-js";
import type { CelulaDetalheDto, CelulaListItemDto } from "../application/dtos";
import { rowToCelulaDetalheDto, rowToCelulaListItemDto } from "./celula.mapper";
import type { CelulaListRow } from "./celula.types";

const TABLE = "celulas";

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
      .order("nome", { ascending: true });

    if (error) throw new Error(error.message);

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

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Célula não encontrada");

    return rowToCelulaDetalheDto(data as unknown as CelulaListRow);
  }
}
