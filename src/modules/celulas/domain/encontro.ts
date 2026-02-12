import { Frequencia } from "./frequencia";

export interface Encontro {
    id: string;
    tema: string;
    data: string;
    anfitriao: string;
    numeroParticipantes: number;
    preletor: string;
    supervisao: "sim" | "não";
    conversoes: "sim" | "não";
    frequencia?: Frequencia[];
}

export interface EncontroInsert {
    celula_id?: string | null;
    tema: string;
    data: string;
    observacoes?: string;
    horario: string;
    local: string;
    criado_em: string;
    criado_por: string;
    deletado: boolean;
}