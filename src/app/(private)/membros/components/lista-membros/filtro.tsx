"use client";

import { Search } from "@mui/icons-material";
import { Box, InputAdornment, List, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";
import { MembroListItem } from "./membroListItem";

export function Filtro({
    data,
    onSelect,
    membroSelecionado,
}: {
    data: MembroListItemDto[];
    onSelect: (membro: MembroListItemDto) => void;
    membroSelecionado: MembroListItemDto | null;
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(
        () =>
            data.filter((membro) =>
                (membro.nome ?? "").toLowerCase().includes(search.toLowerCase())
            ),
        [data, search]
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <TextField
                aria-label="Pesquisar membros"
                variant="outlined"
                placeholder="Pesquisar membros"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    width: "100%",
                    maxWidth: "330px",
                    height: "50px",
                    "& .MuiOutlinedInput-root": {
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
                                    width: 30,
                                    height: 30,
                                    color: "#929EAE",
                                    marginRight: 2,
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
            />

            <List
                sx={{
                    paddingTop: 2,
                    maxHeight: "655px",
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
