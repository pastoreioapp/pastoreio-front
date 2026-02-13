import { createClient } from "@/shared/supabase/client";
import type { Encontro, EncontroInsert } from "../domain/encontro";

export class EncontroRepository {
  async findAll(): Promise<Encontro[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("encontros")
      .select("*")
      .eq("deletado", false)
      .order("data", { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar encontros:", error);
      throw new Error(error.message);
    }
    
    // Retornar dados do banco diretamente
    const encontrosFormatados = (data || []).map((encontro: any) => ({
      ...encontro,
      frequencia: encontro.frequencia || [],
    }));
    
    return encontrosFormatados as Encontro[];
  }

  async create(dados: EncontroInsert): Promise<Encontro> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("encontros")
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
}
