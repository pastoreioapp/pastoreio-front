import type { Edge, Node } from "reactflow";
import { GAP_Y, calculateLevelPosition, getLevelRowCount } from "./layout";
import type { OrganogramaNodeData, OrganogramaPessoa, OrganogramaRole } from "./types";

type OrganogramaNode = Node<OrganogramaNodeData>;
type OrganogramaEdge = Edge;
const ROLE_ORDER: OrganogramaRole[] = [
    "LIDER",
    "AUXILIAR",
    "MEMBRO",
    "VISITANTE",
];

function buildLevelNodes(
    pessoas: OrganogramaPessoa[],
    levelBaseY: number,
    columnsPerLine: number
): OrganogramaNode[] {
    return pessoas.map<OrganogramaNode>((pessoa, index) => ({
        id: pessoa.id.toString(),
        type: "pessoa",
        position: calculateLevelPosition(
            index,
            pessoas.length,
            levelBaseY,
            columnsPerLine
        ),
        data: {
            label: pessoa.nome,
            tags: pessoa.tags,
            foto: pessoa.foto,
            role: pessoa.role,
            hierarchyLevel: pessoa.hierarchyLevel,
            isLeader: pessoa.isLeader,
            isAuxiliar: pessoa.isAuxiliar,
            isMembro: pessoa.isMembro,
            isVisitante: pessoa.isVisitante,
        },
    }));
}

function buildLevelEdges(
    sourceLevel: OrganogramaPessoa[],
    targetLevel: OrganogramaPessoa[]
): OrganogramaEdge[] {
    return targetLevel.flatMap<OrganogramaEdge>((target) =>
        sourceLevel.map((source) => ({
            id: `${source.id}-${target.id}`,
            source: source.id.toString(),
            target: target.id.toString(),
            type: "smoothstep",
        }))
    );
}

export function buildOrganogramaGraph(
    pessoas: OrganogramaPessoa[],
    columnsPerLine: number
): {
    nodes: OrganogramaNode[];
    edges: OrganogramaEdge[];
} {
    const pessoasPorRole = ROLE_ORDER.reduce<Record<OrganogramaRole, OrganogramaPessoa[]>>(
        (acc, role) => {
            acc[role] = pessoas.filter((pessoa) => pessoa.role === role);
            return acc;
        },
        {
            LIDER: [],
            AUXILIAR: [],
            MEMBRO: [],
            VISITANTE: [],
        }
    );

    let currentLevelBaseY = 0;
    const nodes = ROLE_ORDER.flatMap((role) => {
        const pessoasDoNivel = pessoasPorRole[role];
        const nodesDoNivel = buildLevelNodes(
            pessoasDoNivel,
            currentLevelBaseY,
            columnsPerLine
        );

        currentLevelBaseY +=
            getLevelRowCount(pessoasDoNivel.length, columnsPerLine) * GAP_Y;

        return nodesDoNivel;
    });

    const edges = ROLE_ORDER.slice(0, -1).flatMap((role, index) => {
        const currentLevel = pessoasPorRole[role];
        const nextLevel = pessoasPorRole[ROLE_ORDER[index + 1]];

        if (currentLevel.length === 0 || nextLevel.length === 0) {
            return [];
        }

        return buildLevelEdges(currentLevel, nextLevel);
    });

    return {
        nodes,
        edges,
    };
}
