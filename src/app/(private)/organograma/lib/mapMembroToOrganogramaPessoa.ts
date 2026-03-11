import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import type { OrganogramaPessoa, OrganogramaRole } from "./types";

const ROLE_LABELS: Record<OrganogramaRole, string> = {
    [PapelCelula.LIDER_CELULA]: "Líder",
    [PapelCelula.AUXILIAR_CELULA]: "Auxiliar",
    [PapelCelula.MEMBRO]: "Membro",
    [PapelCelula.VISITANTE]: "Visitante",
};

const ROLE_LEVELS: Record<OrganogramaRole, number> = {
    [PapelCelula.LIDER_CELULA]: 0,
    [PapelCelula.AUXILIAR_CELULA]: 1,
    [PapelCelula.MEMBRO]: 2,
    [PapelCelula.VISITANTE]: 3,
};

function normalizeRole(funcao: MembroDaCelulaListItemDto["funcao"]): OrganogramaRole {
    return funcao ?? PapelCelula.MEMBRO;
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
        isLeader: role === PapelCelula.LIDER_CELULA,
        isAuxiliar: role === PapelCelula.AUXILIAR_CELULA,
        isMembro: role === PapelCelula.MEMBRO,
        isVisitante: role === PapelCelula.VISITANTE,
    };
}
