import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { OrganogramaPessoa, OrganogramaRole } from "./types";
import { Perfil } from "@/modules/controleacesso/domain/types";

const ROLE_LABELS: Record<OrganogramaRole, string> = {
    LIDER_CELULA: "Líder",
    AUXILIAR_CELULA: "Auxiliar",
    MEMBRO: "Membro",
    VISITANTE: "Visitante",
};

const ROLE_LEVELS: Record<OrganogramaRole, number> = {
    LIDER_CELULA: 0,
    AUXILIAR_CELULA: 1,
    MEMBRO: 2,
    VISITANTE: 3,
};

function normalizeRole(funcao: string | null | undefined): OrganogramaRole {
    const normalized = (funcao ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();

    if (normalized === "LIDER_CELULA") {
        return "LIDER_CELULA";
    }

    if (normalized === "AUXILIAR_CELULA") {
        return "AUXILIAR_CELULA";
    }

    if (normalized === "VISITANTE") {
        return "VISITANTE";
    }

    return "MEMBRO";
}

function buildTags(role: OrganogramaRole) {
    return [ROLE_LABELS[role]];
}

export function mapMembroToOrganogramaPessoa(
    source: MembroDaCelulaListItemDto
): OrganogramaPessoa {
    const role = normalizeRole(source.funcao);
    
    return {
        id: source.id,
        nome: source.nome ?? "",
        tags: buildTags(role),
        foto: `https://i.pravatar.cc/150?img=${(source.id % 30) + 1}`,
        role,
        hierarchyLevel: ROLE_LEVELS[role],
        isLeader: role === Perfil.LIDER_CELULA,
        isAuxiliar: role === Perfil.AUXILIAR_CELULA,
        isMembro: role === Perfil.MEMBRO,
        isVisitante: role === "VISITANTE",
    };
}
