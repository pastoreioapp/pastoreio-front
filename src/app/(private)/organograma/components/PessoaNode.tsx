"use client";

import { Avatar, Box, Card, Chip, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";
import { ORGANOGRAMA_CARD_WIDTH } from "../lib/layout";
import type { OrganogramaNodeData } from "../lib/types";

type PessoaNodeProps = {
    data: OrganogramaNodeData;
};

function getNodePalette(data: OrganogramaNodeData) {
    if (data.isLeader) {
        return {
            cardBg: "#5E79B3",
            textColor: "#FFFFFF",
            avatarBg: "#F5F5F5",
            avatarColor: "#5E79B3",
            avatarBorder: "#DBDBDB",
            chipBg: "#DCE8E6",
            chipColor: "#1B212D",
        };
    }

    if (data.isAuxiliar) {
        return {
            cardBg: "#DCE8E6",
            textColor: "#1B212D",
            avatarBg: "#5E79B3",
            avatarColor: "#FFFFFF",
            avatarBorder: "#DCE8E6",
            chipBg: "#5E79B3",
            chipColor: "#FFFFFF",
        };
    }

    if (data.isVisitante) {
        return {
            cardBg: "#FFF4E5",
            textColor: "#7A4B00",
            avatarBg: "#FFB74D",
            avatarColor: "#FFFFFF",
            avatarBorder: "#FFE0B2",
            chipBg: "#FFE0B2",
            chipColor: "#7A4B00",
        };
    }

    return {
        cardBg: "#F5F5F5",
        textColor: "#1B212D",
        avatarBg: "#5E79B3",
        avatarColor: "#FFFFFF",
        avatarBorder: "#DCE8E6",
        chipBg: "#DCE8E6",
        chipColor: "#1B212D",
    };
}

export function PessoaNode({ data }: PessoaNodeProps) {
    const palette = getNodePalette(data);

    return (
        <Card
            elevation={4}
            sx={{
                width: ORGANOGRAMA_CARD_WIDTH,
                minHeight: 90,
                padding: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: palette.cardBg,
                boxShadow: "none",
            }}
        >
            <Avatar
                src={data.foto}
                sx={{
                    bgcolor: palette.avatarBg,
                    color: palette.avatarColor,
                    width: 56,
                    height: 56,
                    border: "3px solid",
                    borderColor: palette.avatarBorder,
                }}
            >
                {data.label.charAt(0)}
            </Avatar>

            <Box>
                <Typography
                    fontSize={14}
                    fontWeight={600}
                    color={palette.textColor}
                >
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
                            sx={{
                                bgcolor: palette.chipBg,
                                color: palette.chipColor,
                                fontWeight: 600,
                                borderRadius: 1,
                                fontSize: 11,
                            }}
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
