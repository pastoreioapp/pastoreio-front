"use client";

import { Search } from "@mui/icons-material";
import { Box, InputAdornment, List, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import { EncontroListItem } from "./encontroListItem";

export function Filtro({
    data,
    onSelect,
    encontroSelecionado,
}: {
    data: Encontro[];
    onSelect: (encontro: Encontro) => void;
    encontroSelecionado: Encontro | null;
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(
        () =>
            data.filter((encontro) =>
                encontro.tema.toLowerCase().includes(search.toLowerCase())
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
                aria-label="Pesquisar encontros"
                variant="outlined"
                placeholder="Pesquisar encontros"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    width: "330px",
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
                            fontSize: "14px",
                        },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search
                                sx={{
                                    width: "24px",
                                    height: "24px",
                                    color: "#1B212D",
                                    marginRight: "15px",
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
            />

            <List
                sx={{
                    paddingTop: "15px",
                    maxHeight: "655px",
                    paddingRight: "9px",
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
                {filtered.map((encontro) => (
                    <EncontroListItem
                        key={encontro.id}
                        encontro={encontro}
                        selected={encontroSelecionado?.id === encontro.id}
                        onClick={() => onSelect(encontro)}
                    />
                ))}
            </List>
        </Box>
    );
}
