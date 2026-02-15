import { createClient } from "@/shared/supabase/client";
import type { Encontro } from "../domain/encontro";

const TABLE = "encontros";

export class EncontroRepository {
  async findAll(): Promise<Encontro[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from(TABLE)
      .select("*, frequencias_celula(*, membros(nome))")
      .eq("deletado", false)
      .order("data", { ascending: false });

    if (error) {
      console.error("Erro ao buscar encontros:", error);
      throw new Error(error.message);
    }

    const encontrosFormatados = (data || []).map((encontro: any) => {
      const frequencias = (encontro.frequencias_celula || [])
        .filter((f: any) => !f.deletado)
        .map((f: any) => {
          const { membros, ...rest } = f;
          return { ...rest, membro_nome: membros?.nome };
        });
      const { frequencias_celula: _, ...dadosEncontro } = encontro;
      return {
        ...dadosEncontro,
        frequencia: frequencias,
      };
    });

    return encontrosFormatados as Encontro[];
  }

  async create(dados: Encontro): Promise<Encontro> {
    const supabase = createClient();
    
    const { data, error } = await supabase
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
    const supabase = createClient();
    
    const { data, error } = await supabase
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
