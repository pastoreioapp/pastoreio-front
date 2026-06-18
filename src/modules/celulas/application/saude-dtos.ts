export interface SaudeCelulaResult {
    score: number;
    mensagem: string;
    versiculo: string;
    classe: "florescendo" | "saudavel" | "atencao" | "critica";
}
