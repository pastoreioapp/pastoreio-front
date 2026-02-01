export interface Frequencia {
    nome: string;
    situacao: Situacao;
}

export type Situacao = "presente" | "faltou" | "justificado";