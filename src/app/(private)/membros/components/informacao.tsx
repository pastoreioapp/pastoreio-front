"use client";

import { Box, Typography } from "@mui/material";
import { IconPencil } from "@tabler/icons-react";
import { InformacaoHeader } from "./informacoesHeader";
import { InformacoesGroup } from "./informacoesGroup";
import { Membro } from "@/features/membros/types";
import { EtapasTabs } from "./etapasTabs";

const MensagemNenhumMembroSelecionado = () => (
    <Box
        sx={{
            border: "1px solid #F5F5F5",
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Typography sx={{ color: "#999", fontSize: "16px" }}>
            Selecione um membro para visualizar suas informações
        </Typography>
    </Box>
);

export function Informacao({ data }: { data: Membro | null }) {
    if (!data) return <MensagemNenhumMembroSelecionado />;

    const grupos = [
        {
            titulo: "Dados Pessoais",
            campos: [
                { label: "Telefone", valor: data.telefone },
                { label: "Email", valor: data.email },
                { label: "Nascimento", valor: data.nascimento },
                { label: "Endereço", valor: data.endereco },
            ],
        },
        {
            titulo: "Dados Familiares",
            campos: [
                { label: "Estado Civil", valor: data.estadoCivil },
                { label: "Cônjuge", valor: data.conjuge },
                { label: "Filhos", valor: data.filhos },
            ],
        },
        {
            titulo: "Dados Ministeriais",
            campos: [
                { label: "Discípulo de", valor: data.discipulador },
                { label: "Discipulando", valor: data.discipulando },
                { label: "Ministério", valor: data.ministerio },
            ],
        },
    ];

    return (
        <Box
            sx={{
                border: "1px solid #F5F5F5",
                borderRadius: "10px",
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    pt: "15px",
                    pr: "15px",
                    pl: "64px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "77px",
                }}
            >
                <InformacaoHeader nome={data.nome} funcao={data.funcao} />

                {grupos.map((grupo, i) => (
                    <Box key={i}>
                        <InformacoesGroup
                            titulo={grupo.titulo}
                            campos={grupo.campos}
                        />
                    </Box>
                ))}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "start",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#5E79B3",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <IconPencil size={14} />
                        Editar
                    </Typography>
                </Box>
            </Box>

            <EtapasTabs />
        </Box>
    );
}
