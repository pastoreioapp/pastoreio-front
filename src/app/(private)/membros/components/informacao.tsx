"use client";

import { Box, Grid, Tab, Typography } from "@mui/material";
import { IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import { InformacaoHeader } from "./informacoesHeader";
import { InformacoesGroup } from "./informacoesGroup";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { EtapaCard } from "./etapaCard";
import { listaTrajetoria } from "./listaTrajetoria";
import { Membro } from "@/features/membros/types";

export function Informacao({ data }: { data: Membro }) {
    const [tab, setTab] = useState("1");

    return (
        <Box
            sx={{
                border: "1px solid #ECECEC",
                width: "100%",
                borderRadius: 2,
                p: 2,
            }}
        >
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
                    }}
                >
                    <IconPencil size={14} />
                    Editar
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <InformacaoHeader nome={data.nome} funcao={data.funcao} />

                <InformacoesGroup
                    titulo="Dados Pessoais"
                    campos={[
                        { label: "Telefone", valor: data.telefone },
                        { label: "Email", valor: data.email },
                        { label: "Nascimento", valor: data.nascimento },
                        { label: "Endereço", valor: data.endereco },
                    ]}
                />

                <InformacoesGroup
                    titulo="Dados Familiares"
                    campos={[
                        { label: "Estado Civil", valor: data.estadoCivil },
                        { label: "Cônjuge", valor: data.conjuge },
                        { label: "Filhos", valor: data.filhos },
                    ]}
                />

                <InformacoesGroup
                    titulo="Dados Ministeriais"
                    campos={[
                        { label: "Discípulo de", valor: data.discipulador },
                        { label: "Discipulando", valor: data.discipulando },
                        { label: "Ministério", valor: data.ministerio },
                    ]}
                />
            </Grid>

            <TabContext value={tab}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <TabList onChange={(e, newValue) => setTab(newValue)}>
                        <Tab
                            label="Trajetória"
                            value="1"
                            sx={{ fontSize: "16px", fontWeight: "500" }}
                        />
                        <Tab
                            label="Cursos EMP"
                            value="2"
                            sx={{
                                fontSize: "16px",
                                fontWeight: "500",
                                position: "relative",
                                mx: 1,
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    top: "25%",
                                    bottom: "25%",
                                    width: "1px",
                                    background:
                                        "linear-gradient(to bottom, #eee, #C5C5C5, #eee)",
                                },
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    right: 0,
                                    top: "25%",
                                    bottom: "25%",
                                    width: "1px",
                                    background:
                                        "linear-gradient(to bottom, #eee, #C5C5C5, #eee)",
                                },
                            }}
                        />
                        <Tab
                            label="Frequência"
                            value="3"
                            sx={{ fontSize: "16px", fontWeight: "500" }}
                        />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <EtapaCard
                                etapa={1}
                                titulo="Pastoreio 1"
                                itens={listaTrajetoria.pastoreio1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <EtapaCard
                                etapa={2}
                                titulo="Pastoreio 2"
                                itens={listaTrajetoria.pastoreio2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <EtapaCard
                                etapa={3}
                                titulo="Discipulado"
                                itens={listaTrajetoria.discipulado}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <EtapaCard
                                etapa={4}
                                titulo="Líder de Célula"
                                itens={listaTrajetoria.lider}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value="2">Cursos EMP</TabPanel>
                <TabPanel value="3">Frequência</TabPanel>
            </TabContext>
        </Box>
    );
}
