import { Frequencia } from "./frequencia";

export interface Encontro {
    id?: string;
    celula_id?: string | null;
    tema: string;
    data: string;
    horario: string;
    local: string;
    anfitriao: string;
    preletor: string;
    supervisao: boolean;
    conversoes: boolean;
    observacoes?: string;
    criado_em: string;
    criado_por: string;
    atualizado_em?: string;
    atualizado_por?: string;

    frequencia?: Frequencia[];
}