import type { PapelCelula } from "@/modules/celulas/domain/papel-celula";

export type OrganogramaRole = PapelCelula;

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

