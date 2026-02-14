"use client";
import dynamic from "next/dynamic";
import {
    Background,
    Controls,
    Handle,
    Position,
    ReactFlowProvider,
} from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { Avatar, Box, Card, Chip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageContainer from "@/ui/components/pages/PageContainer";
import { listMembros } from "@/app/actions/membros";
import { MembroListItemDto } from "@/modules/secretaria/application/dtos";

const ReactFlow = dynamic(
    () => import("reactflow").then((mod) => mod.default),
    { ssr: false }
);

type PessoaAPI = {
    id: number;
    nome: string;
    tags: string[];
    foto?: string;
};

const CARDS_PER_LINE = 3;
const CARD_WIDTH = 240;
const GAP_X = 300;
const GAP_Y = 180;

const LEADER_Y = 0;
const MEMBER_START_Y = GAP_Y;

function calcularPosicaoLider(index: number, total: number) {
    if (total === 1) {
        return { x: 400, y: LEADER_Y };
    }

    if (total === 2) {
        return {
            x: index === 0 ? 250 : 550,
            y: LEADER_Y,
        };
    }

    return {
        x: 100 + index * GAP_X,
        y: LEADER_Y,
    };
}

function calcularPosicaoMembro(index: number) {
    const linha = Math.floor(index / CARDS_PER_LINE);
    const coluna = index % CARDS_PER_LINE;

    return {
        x: 100 + coluna * GAP_X,
        y: MEMBER_START_Y + linha * GAP_Y,
    };
}

function gerarNodes(pessoas: PessoaAPI[]): Node[] {
    const leaders = pessoas.filter((p) => p.tags.includes("Liderança"));
    const members = pessoas.filter((p) => !p.tags.includes("Liderança"));

    const leaderNodes = leaders.map((pessoa, index) => ({
        id: pessoa.id.toString(),
        type: "pessoa",
        position: calcularPosicaoLider(index, leaders.length),
        data: {
            label: pessoa.nome,
            tags: pessoa.tags,
            foto: pessoa.foto,
        },
    }));

    const memberNodes = members.map((pessoa, index) => ({
        id: pessoa.id.toString(),
        type: "pessoa",
        position: calcularPosicaoMembro(index),
        data: {
            label: pessoa.nome,
            tags: pessoa.tags,
            foto: pessoa.foto,
        },
    }));

    return [...leaderNodes, ...memberNodes];
}

function gerarEdges(pessoas: PessoaAPI[]): Edge[] {
    const leaders = pessoas.filter((p) => p.tags.includes("Liderança"));
    const members = pessoas.filter((p) => !p.tags.includes("Liderança"));

    const edges: Edge[] = [];

    members.forEach((member) => {
        leaders.forEach((leader) => {
            edges.push({
                id: `${leader.id}-${member.id}`,
                source: leader.id.toString(),
                target: member.id.toString(),
                type: "smoothstep",
            });
        });
    });
    return edges;
}

type PessoaNodeData = {
    label: string;
    tags: string[];
    foto?: string;
};

function PessoaNode({ data }: { data: PessoaNodeData }) {
    const isLeader = data.tags.includes("Liderança");

    return (
        <Card
            elevation={4}
            sx={{
                width: 240,
                height: 90,
                padding: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: isLeader ? "#5E79B3" : "#F5F5F5",
            }}
        >
            <Avatar
                src={data.foto}
                sx={{
                    bgcolor: isLeader ? "#F5F5F5" : "#5E79B3",
                    color: isLeader ? "#5E79B3" : "#FFF",
                    width: 56,
                    height: 56,
                }}
            >
                {data.label.charAt(0)}
            </Avatar>

            <Box>
                <Typography fontSize={14} fontWeight={600}>
                    {data.label}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        flexWrap: "wrap",
                        mt: 0.5,
                    }}
                >
                    {data.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            color={tag === "Líder" ? "primary" : "default"}
                        />
                    ))}
                </Box>
            </Box>

            <Handle
                type="target"
                position={Position.Top}
                style={{ opacity: 0 }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ opacity: 0 }}
            />
        </Card>
    );
}

const nodeTypes = { pessoa: PessoaNode };

function mapMembroToPessoa(membro: MembroListItemDto): PessoaAPI {
    return {
        id: membro.id,
        nome: membro.nome ?? "",
        tags: [membro.ministerio ?? ""],
        foto: "https://i.pravatar.cc/150?img=12",
    };
}

export default function Orgonograma() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        async function load() {
            const membros: MembroListItemDto[] = await listMembros();

            const pessoas: PessoaAPI[] = membros.map(mapMembroToPessoa);
            setNodes(gerarNodes(pessoas));
            setEdges(gerarEdges(pessoas));
        }

        load();
    }, []);

    return (
        <PageContainer
            title="Organograma"
            description="Hierarquia real (sem root)"
        >
            <div
                className="bg-white rounded-xl shadow-lg border px-4 py-3 min-w-[200px] flex items-center gap-3"
                style={{ width: "100%", height: "750px" }}
            >
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        fitView
                        nodesDraggable={false}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </PageContainer>
    );
}
