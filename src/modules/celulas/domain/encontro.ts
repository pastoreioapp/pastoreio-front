import { Frequencia } from "./frequencia";

export interface Encontro {
    id: string;
    tema: string;
    data: string;
    anfitriao: string;
    numeroParticipantes: number;
    preletor: string;
    supervisao: boolean;
    conversoes: boolean;
    frequencia?: Frequencia[];
}

export interface EncontroInsert {
    celula_id?: string | null;
    tema: string;
    data: string;
    observacoes?: string;
    horario: string;
    local: string;
    supervisao: boolean;
    conversoes: boolean;
    criado_em: string;
    criado_por: string;
    deletado: boolean;
}