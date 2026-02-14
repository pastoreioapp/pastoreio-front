export interface Frequencia {
    id?: number;
    encontro_id: number;
    membro_id: number;
    presente: boolean;
    justificado?: boolean;
    justificativa? : string;
    
    criado_em: string;
    criado_por: string;
    atualizado_em?: string;
    atualizado_por?: string;
}