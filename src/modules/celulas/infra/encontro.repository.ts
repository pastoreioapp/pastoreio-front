import type { SupabaseClient } from "@supabase/supabase-js";
import type { Encontro } from "../domain/encontro";
import type { Frequencia } from "../domain/frequencia";

const TABLE = "encontros";

type FrequenciaRow = Frequencia & {
  membros?: { nome?: string; };
};

type EncontroRow = Encontro & {
  frequencias_celula?: FrequenciaRow[];
};

function mapEncontros(data: EncontroRow[] | null): Encontro[] {
  return (data || []).map((encontro) => {
    const frequencias = (encontro.frequencias_celula || [])
      .map((f) => {
        const { membros, ...rest } = f;
        return { ...rest, membro_nome: membros?.nome };
      });
    const { frequencias_celula: _, ...dadosEncontro } = encontro;
    return {
      ...dadosEncontro,
      frequencia: frequencias,
    };
  }) as Encontro[];
}

export class EncontroRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByCelulaId(celulaId: number): Promise<Encontro[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("*, frequencias_celula(*, membros(nome))")
      .eq("celula_id", celulaId)
      .eq("deletado", false)
      .eq("frequencias_celula.deletado", false)
      .order("data", { ascending: false });

    if (error) {
      console.error("Erro ao buscar encontros:", error);
      throw new Error(error.message);
    }

    return mapEncontros(data);
  }

  async create(dados: Encontro): Promise<Encontro> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .insert([dados])
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao criar encontro:", error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error("Nenhum dado retornado do Supabase após inserção");
    }
    
    return data;
  }

  async update(id: string, dados: Partial<Encontro>): Promise<Encontro> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .update(dados)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao atualizar encontro:", error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error("Nenhum dado retornado do Supabase após atualização");
    }
    
    return data;
  }
}
