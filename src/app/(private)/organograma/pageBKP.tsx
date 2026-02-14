"use client";
import dynamic from "next/dynamic";
import {
    Background,
    Controls,
    Handle,
    Position,
    ReactFlowProvider,
} from "reactflow";
import PageContainer from "@/components/pages/PageContainer";
import DashboardCard from "@/components/ui/DashboardCard";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { Avatar, Box, Card, Chip, Typography } from "@mui/material";

const ReactFlow = dynamic(
    () => import("reactflow").then((mod) => mod.default),
    { ssr: false }
);

type PessoaNodeData = {
    label: string;
    tags: string[];
    isLeader?: boolean;
    foto?: string;
};
function PessoaNode({ data }: { data: PessoaNodeData }) {
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
                backgroundColor: "#fff",
                bgcolor: data.isLeader ? "#5E79B3" : "#F5F5F5",
            }}
        >
            <Avatar
                src={data.foto}
                sx={{
                    bgcolor: data.isLeader ? "#F5F5F5" : "#5E79B3",
                    width: 60,
                    height: 60,
                    fontSize: 16,
                    ml: "20px",
                }}
            >
                {data.label.charAt(0)}
            </Avatar>
            <Box sx={{ mt: 25, mb: 25, ml: "21px" }}>
                <Typography fontSize={14} fontWeight={600}>
                    {data.label}
                </Typography>
                {data.tags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                            fontSize: 11,
                            height: 20,
                            bgcolor: data.isLeader ? "#E3EAFB" : "#E0E0E0",
                        }}
                    />
                ))}
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

const nodes: Node[] = [
    {
        id: "l1",
        type: "pessoa",
        position: { x: 250, y: 0 },
        data: {
            label: "Samuel",
            tags: ["Líder"],
            foto: "https://i.pravatar.cc/150?img=12",
            isLeader: true,
        },
    },
    {
        id: "l2",
        type: "pessoa",
        position: { x: 550, y: 0 },
        data: {
            label: "Mariane",
            tags: ["Líder"],
            foto: "https://i.pravatar.cc/150?img=32",
            isLeader: true,
        },
    },
    {
        id: "m1",
        type: "pessoa",
        position: { x: 100, y: 180 },
        data: {
            label: "Victor",
            tags: ["TI", "Suporte"],
            foto: "https://i.pravatar.cc/150?img=5",
        },
    },
    {
        id: "m2",
        type: "pessoa",
        position: { x: 400, y: 180 },
        data: {
            label: "Amanda",
            tags: ["RH", "Recrutamento"],
            foto: "https://i.pravatar.cc/150?img=47",
        },
    },
    {
        id: "m3",
        type: "pessoa",
        position: { x: 700, y: 180 },
        data: {
            label: "Douglas",
            tags: ["Financeiro"],
            foto: "https://i.pravatar.cc/150?img=18",
        },
    },
    {
        id: "m4",
        type: "pessoa",
        position: { x: 100, y: 360 },
        data: {
            label: "Lucas",
            tags: ["Estágio", "TI"],
            foto: "https://i.pravatar.cc/150?img=18",
        },
    },
    {
        id: "m5",
        type: "pessoa",
        position: { x: 400, y: 360 },
        data: {
            label: "Rayane",
            tags: ["Marketing", "Design"],
            foto: "https://i.pravatar.cc/150?img=18",
        },
    },
    {
        id: "m6",
        type: "pessoa",
        position: { x: 700, y: 360 },
        data: {
            label: "Fernanda",
            tags: ["RH"],
            foto: "https://i.pravatar.cc/150?img=18",
        },
    },
];

const edges: Edge[] = [
    { id: "e1", source: "l1", target: "m1", type: "smoothstep" },
    { id: "e2", source: "l2", target: "m1", type: "smoothstep" },
    { id: "e3", source: "l1", target: "m2", type: "smoothstep" },
    { id: "e3", source: "l2", target: "m2", type: "smoothstep" },
    { id: "e4", source: "l1", target: "m3", type: "smoothstep" },
    { id: "e4", source: "l2", target: "m3", type: "smoothstep" },
    { id: "e5", source: "l1", target: "m4", type: "smoothstep" },
    { id: "e5", source: "l2", target: "m4", type: "smoothstep" },
    { id: "e6", source: "l1", target: "m5", type: "smoothstep" },
    { id: "e6", source: "l2", target: "m5", type: "smoothstep" },
    { id: "e7", source: "l1", target: "m6", type: "smoothstep" },
    { id: "e7", source: "l2", target: "m6", type: "smoothstep" },
];

export default function Orgonograma() {
    return (
        <PageContainer
            title="Organograma"
            description="Hierarquia real (sem root)"
        >
            <DashboardCard>
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
            </DashboardCard>
        </PageContainer>
    );
}
