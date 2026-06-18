export type Severidade = "critico" | "alerta" | "observacao";

export interface MembroEmAtencaoResult {
    id: string;
    nome: string;
    avatarUrl?: string;
    severidade: Severidade;
    motivos: string[];
    diasSemContato: number;
    telefone?: string;
}
