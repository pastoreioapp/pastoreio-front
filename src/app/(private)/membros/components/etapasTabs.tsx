import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { EtapaCard } from "./etapaCard";
import { listaTrajetoria } from "./listaTrajetoria";

const STYLE_TAB = {
    fontSize: "16px",
    fontWeight: "500",
    width: "180px",
    color: "#C5C5C5",
    "&.Mui-selected": {
        color: "#000",
    },
};

export function EtapasTabs() {
    const [tab, setTab] = useState("1");

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            paddingTop="10px"
            marginX="auto"
            sx={{
                width: "800px",
                overflowX: "auto",
            }}
        >
            <TabContext value={tab}>
                <Box
                    display="flex"
                    justifyContent="center"
                    borderBottom={1}
                    borderColor="divider"
                >
                    <TabList
                        onChange={(e, v) => setTab(v)}
                        TabIndicatorProps={{
                            sx: {
                                backgroundColor: "#E7E7E7",
                                borderRadius: "1.5px",
                            },
                        }}
                    >
                        <Tab label="Trajetória" value="1" sx={STYLE_TAB} />
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
                        <Tab label="Frequência" value="3" sx={STYLE_TAB} />
                    </TabList>
                </Box>
                <TabPanel
                    value="1"
                    sx={{
                        padding: 0,
                        paddingTop: "10px",
                    }}
                >
                    <Box display="flex" justifyContent="center" gap={2}>
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
                    <Box mx="145px">Cursos EMP</Box>
                </TabPanel>
                <TabPanel value="3">
                    <Box mx="145px">Frequência</Box>
                </TabPanel>
            </TabContext>
        </Box>
    );
}
