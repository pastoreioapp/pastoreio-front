"use client";

import dynamic from "next/dynamic";
import { Background, Controls, MarkerType, ReactFlowProvider } from "reactflow";
import type { Edge, Node, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import { PessoaNode } from "./PessoaNode";
import type { OrganogramaNodeData } from "../lib/types";

const ReactFlow = dynamic(
    () => import("reactflow").then((mod) => mod.default),
    { ssr: false }
);

const nodeTypes: NodeTypes = {
    pessoa: PessoaNode,
};

type OrganogramaFlowProps = {
    nodes: Node<OrganogramaNodeData>[];
    edges: Edge[];
};

export function OrganogramaFlow({ nodes, edges }: OrganogramaFlowProps) {
    return (
        <ReactFlowProvider>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                
                defaultEdgeOptions={{
                    type: "smoothstep",
                    animated: false,
                    style: {
                        strokeWidth: 2,
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 18,
                        height: 18,
                    },
                }}
            >
                <Background gap={24} size={1} color="#E6ECF5" />
                <Controls />
            </ReactFlow>
        </ReactFlowProvider>
    );
}
