"use client";

import dynamic from "next/dynamic";
import { Background, Controls, MarkerType, ReactFlowProvider } from "reactflow";
import type { Edge, Node, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import { PessoaNode } from "./PessoaNode";
import { useTopAlignedViewport } from "../hooks/useTopAlignedViewport";
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
    const { containerRef, handleInit } = useTopAlignedViewport(nodes);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onInit={handleInit}
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    defaultEdgeOptions={{
                        type: "smoothstep",
                        animated: false,
                        style: {
                            strokeWidth: 2,
                            stroke: "#D3D3D3",
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 18,
                            height: 18,
                            color: "#D3D3D3",
                        },
                    }}
                >
                    <Background gap={24} size={1} color="#E6ECF5" />
                    <Controls />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}
