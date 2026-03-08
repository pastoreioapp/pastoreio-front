import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { OrganogramaPessoa, OrganogramaRole } from "./types";

const ROLE_LABELS: Record<OrganogramaRole, string> = {
    LIDER: "Líder",
    AUXILIAR: "Auxiliar",
    MEMBRO: "Membro",
    VISITANTE: "Visitante",
};

const ROLE_LEVELS: Record<OrganogramaRole, number> = {
    LIDER: 0,
    AUXILIAR: 1,
    MEMBRO: 2,
    VISITANTE: 3,
};

function normalizeRole(funcao: string | null | undefined): OrganogramaRole {
    const normalized = (funcao ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();

    if (normalized === "LIDER") {
        return "LIDER";
    }

    if (normalized === "AUXILIAR") {
        return "AUXILIAR";
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
        isLeader: role.toLowerCase() === "lider",
        isAuxiliar: role.toLowerCase() === "auxiliar",
        isMembro: role.toLowerCase() === "membro",
        isVisitante: role.toLowerCase() === "visitante",
    };
}
