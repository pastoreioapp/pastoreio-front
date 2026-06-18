"use client";

import { Search } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, List, TextField, Typography } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import { MembroListItem } from "./membroListItem";

export function Filtro({
    data,
    onSelect,
    membroSelecionado,
    onRegistrar,
}: {
    data: MembroDaCelulaListItemDto[];
    onSelect: (membro: MembroDaCelulaListItemDto) => void;
    membroSelecionado: MembroDaCelulaListItemDto | null;
    onRegistrar: () => void;
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(
        () =>
            data.filter((membro) =>
                (membro.nome ?? "").toLowerCase().includes(search.toLowerCase())
            ),
        [data, search]
    );

    const hasFilter = search.length > 0;
    const countLabel = hasFilter
        ? `${filtered.length} de ${data.length} membros`
        : `${data.length} membros`;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                    aria-label="Pesquisar membros"
                    variant="outlined"
                    placeholder="Pesquisar membros"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        flex: 1,
                        height: "40px",
                        "& .MuiOutlinedInput-root": {
                            height: "40px",
                            backgroundColor: "#F8F8F8",
                            borderRadius: 2,
                            "& fieldset": {
                                borderColor: "#F5F5F5",
                            },
                            "&:hover fieldset": {
                                borderColor: "#E0E0E0",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#5E79B3",
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: "#929EAE",
                                opacity: 1,
                                fontSize: ".9rem",
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        color: "#929EAE",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
                <IconButton
                    onClick={onRegistrar}
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#5E79B3",
                        color: "#fff",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#4A6499" },
                    }}
                >
                    <IconPlus size={20} />
                </IconButton>
            </Box>

            <Typography
                sx={{
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    mt: 1,
                    mb: 0.5,
                }}
            >
                {countLabel}
            </Typography>

            <List
                sx={{
                    paddingTop: 1,
                    maxHeight: "calc(100vh - 240px)",
                    paddingRight: 2,
                    overflowY: "auto",
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#C9C9C9",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#F5F5F5",
                    },
                }}
            >
                {filtered.map((membro) => (
                    <MembroListItem
                        key={membro.id}
                        membro={membro}
                        selected={membroSelecionado?.id === membro.id}
                        onClick={() => onSelect(membro)}
                    />
                ))}
            </List>
        </Box>
    );
}
