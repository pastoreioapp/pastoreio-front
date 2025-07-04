"use client";

import { Search } from "@mui/icons-material";
import { Box, InputAdornment, List, TextField } from "@mui/material";
import { useState } from "react";
import { renderMembroItem } from "./renderMembroItem";
import { Membro } from "@/features/membros/types";

export function Filtro({
    data,
    onSelect,
}: {
    data: Membro[];
    onSelect: (membro: Membro) => void;
}) {
    const [search, setSearch] = useState("");

    const filtered = data.filter((membro) =>
        membro.nome.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <TextField
                variant="outlined"
                placeholder="Pesquisar membros"
                sx={{ width: "100%" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                    style: {
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                    },
                }}
            />

            <List
                sx={{
                    width: "100%",
                    padding: 0,
                    mt: 2,
                }}
            >
                {filtered.map((membro, index) =>
                    renderMembroItem(membro, index, () => onSelect(membro))
                )}
            </List>
        </Box>
    );
}
