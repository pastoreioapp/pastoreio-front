export type OrganogramaRole =
    | "LIDER_CELULA"
    | "AUXILIAR_CELULA"
    | "MEMBRO"
    | "VISITANTE";

export type OrganogramaPessoa = {
    id: number;
    nome: string;
    tags: string[];
    foto?: string;
    role: OrganogramaRole;
    hierarchyLevel: number;
    isLeader: boolean;
    isAuxiliar: boolean;
    isMembro: boolean;
    isVisitante: boolean;
};

export type OrganogramaNodeData = {
    label: string;
    tags: string[];
    foto?: string;
    role: OrganogramaRole;
    hierarchyLevel: number;
    isLeader: boolean;
    isAuxiliar: boolean;
    isMembro: boolean;
    isVisitante: boolean;
};

