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
    numeroParticipantes: number;
    preletor: string;
    supervisao: "sim" | "não";
    conversoes: "sim" | "não";
    frequencia: Frequencia[];
}
