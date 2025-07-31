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
                border: "1px solid #F5F5F5",
                width: "100%",
                height: "100%",
                borderRadius: "10px",
            }}
        >
            <Box
                sx={{
                    paddingTop: "15px",
                    paddingRight: "15px",
                    paddingLeft: "64px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "77px",
                }}
            >
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
            </Box>

            {/* <Box sx={{ marginX: "150px", paddingTop: "10px", width: "819px" }}> */}
            <Box
                sx={{
                    paddingX: "80px",
                    // width: "100%",
                    paddingTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflowY: "auto",
                }}
            >
                <TabContext value={tab}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <TabList
                            onChange={(e, newValue) => setTab(newValue)}
                            TabIndicatorProps={{
                                sx: {
                                    backgroundColor: "#E7E7E7",
                                    borderRadius: "1.5px",
                                },
                            }}
                        >
                            <Tab
                                label="Trajetória"
                                value="1"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    width: "180px",
                                    color: "#C5C5C5",
                                    "&.Mui-selected": {
                                        color: "#000",
                                    },
                                }}
                            />
                            <Tab
                                label="Cursos EMP"
                                value="2"
                                sx={{
                                    width: "180px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    position: "relative",
                                    mx: 1,
                                    color: "#C5C5C5",
                                    "&.Mui-selected": {
                                        color: "#000",
                                    },
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
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    width: "180px",
                                    color: "#C5C5C5",
                                    "&.Mui-selected": {
                                        color: "#000",
                                    },
                                }}
                            />
                        </TabList>
                    </Box>
                    <TabPanel
                        value="1"
                        sx={{
                            padding: 0,
                            paddingTop: "10px",
                            paddingBottom: "px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px",
                            }}
                        >
                            <EtapaCard
                                etapa={1}
                                titulo="Pastoreio 1"
                                itens={listaTrajetoria.pastoreio1}
                            />

                            <EtapaCard
                                etapa={2}
                                titulo="Pastoreio 2"
                                itens={listaTrajetoria.pastoreio2}
                            />

                            <EtapaCard
                                etapa={3}
                                titulo="Discipulado"
                                itens={listaTrajetoria.discipulado}
                            />

                            <EtapaCard
                                etapa={4}
                                titulo="Líder de Célula"
                                itens={listaTrajetoria.lider}
                            />
                        </Box>
                    </TabPanel>
                    <TabPanel value="2">
                        <Box sx={{ mx: "145px" }}>Cursos EMP</Box>
                    </TabPanel>
                    <TabPanel value="3">
                        <Box sx={{ mx: "145px" }}>Frequência</Box>
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
    );
}
