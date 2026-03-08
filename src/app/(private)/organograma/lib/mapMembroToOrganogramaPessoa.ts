import { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { OrganogramaPessoa } from "./types";

function normalizeTags(source: MembroDaCelulaListItemDto) {
    return source.funcao ? [source.funcao] : [];
}

export function mapMembroToOrganogramaPessoa(source: MembroDaCelulaListItemDto): OrganogramaPessoa {
    const tags = normalizeTags(source);
    const isLeader = tags.includes("LÍDER");
    const isAuxiliar = tags.includes("AUXILIAR");

    return {
        id: source.id,
        nome: source.nome ?? "",
        tags,
        foto: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 30) + 1}`,
        isLeader,
        isAuxiliar,
    };
}
