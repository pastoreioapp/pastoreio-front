import type { MetaCelulaDto } from "./dtos";
import type { MetasCelulaRepository, MetaComValor } from "../infra/metas-celula.repository";

function inferirFormato(nome: string): { formato?: "moeda" | "numero"; unidade?: string } {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes("oferta") || nomeLower.includes("dízimo") || nomeLower.includes("financ")) {
        return { formato: "moeda" };
    }
    if (nomeLower.includes("vida")) return { unidade: "vidas" };
    if (nomeLower.includes("casa")) return { unidade: "casas" };
    if (nomeLower.includes("batismo")) return { unidade: "batismos" };
    return {};
}

function toDto(row: MetaComValor): MetaCelulaDto {
    const { formato, unidade } = inferirFormato(row.nome);
    return {
        id: String(row.metaId),
        titulo: row.nome,
        valorAtual: row.valorAlcancado,
        valorMeta: row.valorEsperado,
        formato,
        unidade,
    };
}

export class MetasCelulaService {
    constructor(private readonly repo: MetasCelulaRepository) {}

    async list(celulaId: number): Promise<MetaCelulaDto[]> {
        const rows = await this.repo.findByCelulaIdNoPeriodoAtual(celulaId);
        return rows.map(toDto);
    }
}
