import { createClient } from "../supabase/client";
import { Encontro, EncontroInsert } from "./types";

export async function getEncontros(): Promise<Encontro[]> {
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
    
    // Converter formato do banco para formato do frontend
    const encontrosFormatados = (data || []).map((encontro: any) => ({
        ...encontro,
        supervisao: encontro.supervisao ? "sim" : "não",
        conversoes: encontro.conversoes ? "sim" : "não",
        frequencia: encontro.frequencia || [],
    }));
    
    return encontrosFormatados as Encontro[];
}

export async function criarEncontro(dados: EncontroInsert): Promise<any> {
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
    
    return data;
}

export async function atualizarEncontro(id: string, dados: Partial<EncontroInsert>): Promise<any> {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from("encontros")
        .update(dados)
        .eq("id", id)
        .select()
        .single();
    
    if (error) {
        console.error("Erro ao atualizar encontro:", error);
        throw new Error(error.message);
    }
    
    return data;
}

export async function deletarEncontro(id: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
        .from("encontros")
        .update({ deletado: true })
        .eq("id", id);
    
    if (error) {
        console.error("Erro ao deletar encontro:", error);
        throw new Error(error.message);
    }
}
