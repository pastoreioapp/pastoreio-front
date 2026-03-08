import type { Edge, Node } from "reactflow";
import { calculateLeaderPosition, calculateMemberPosition } from "./layout";
import type { OrganogramaNodeData, OrganogramaPessoa } from "./types";

type OrganogramaNode = Node<OrganogramaNodeData>;
type OrganogramaEdge = Edge;

export function buildOrganogramaGraph(pessoas: OrganogramaPessoa[]): {
    nodes: OrganogramaNode[];
    edges: OrganogramaEdge[];
} {
    const leaders = pessoas.filter((pessoa) => pessoa.isLeader);
    const members = pessoas.filter((pessoa) => !pessoa.isLeader);

    const leaderNodes = leaders.map<OrganogramaNode>((pessoa, index) => ({
        id: pessoa.id.toString(),
        type: "pessoa",
        position: calculateLeaderPosition(index, leaders.length),
        data: {
            label: pessoa.nome,
            tags: pessoa.tags,
            foto: pessoa.foto,
            isLeader: pessoa.isLeader,
            isAuxiliar: pessoa.isAuxiliar,
        },
    }));

    const memberNodes = members.map<OrganogramaNode>((pessoa, index) => ({
        id: pessoa.id.toString(),
        type: "pessoa",
        position: calculateMemberPosition(index),
        data: {
            label: pessoa.nome,
            tags: pessoa.tags,
            foto: pessoa.foto,
            isLeader: pessoa.isLeader,
            isAuxiliar: pessoa.isAuxiliar,
        },
    }));

    const edges = members.flatMap<OrganogramaEdge>((member) =>
        leaders.map((leader) => ({
            id: `${leader.id}-${member.id}`,
            source: leader.id.toString(),
            target: member.id.toString(),
            type: "smoothstep",
        }))
    );

    return {
        nodes: [...leaderNodes, ...memberNodes],
        edges,
    };
}
