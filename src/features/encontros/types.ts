type Situacao = "presente" | "faltou" | "justificado";

interface Frequencia {
    nome: string;
    situacao: Situacao;
}

export interface Encontro {
    id: string;
    tema: string;
    data: string;
    anfitriao: string;
    numeroParticipantes?: number;
    preletor: string;
    supervisao: "sim" | "não";
    conversoes: "sim" | "não";
    frequencia?: Frequencia[]; // Opcional - pode não vir do banco
}

// Tipo para inserção/atualização no banco (Supabase)
export interface EncontroInsert {
    id?: string;
    tema: string;
    data: string;
    anfitriao: string;
    preletor: string;
    supervisao: boolean;
    conversoes: boolean;
    celula_id?: number;
    horario?: string;
    local?: string;
    observacoes?: string;
}
