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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <TextField
                variant="outlined"
                placeholder="Pesquisar membros"
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
                {filtered.map((membro, index) =>
                    renderMembroItem(membro, index, () => onSelect(membro))
                )}
            </List>
        </Box>
    );
}
