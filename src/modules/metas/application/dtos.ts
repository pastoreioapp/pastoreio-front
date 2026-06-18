export interface MetaCelulaDto {
    id: string;
    titulo: string;
    valorAtual: number;
    valorMeta: number;
    unidade?: string;
    formato?: "moeda" | "numero";
}
