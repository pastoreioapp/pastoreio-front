import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { EtapaCard } from "./etapaCard";
import { listaTrajetoria } from "./listaTrajetoria";
import { IconInfoCircle, IconInfoCircleFilled, IconInfoOctagon } from "@tabler/icons-react";
import { IconChartBar } from "@tabler/icons-react";

const STYLE_TAB = {
    fontSize: { xs: "14px", md: "16px" },
    fontWeight: "500",
    width: { xs: "auto", md: "180px" },
    minWidth: "unset",
    padding: { xs: 1.5, md: 2.5 },
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
                        <Tab label="Cursos EMP" value="2" sx={STYLE_TAB} />
                        <Tab label="Frequência" value="3" sx={STYLE_TAB} />
                    </TabList>
                </Box>
                <TabPanel
                    value="1"
                    sx={{
                        paddingTop: 4,
                    }}
                >
                    <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
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
                    <Box mx="145px" display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                            <IconInfoCircleFilled size={24} />
                            Funcionalidade disponível em breve!
                        </Typography>
                    </Box>
                </TabPanel>
                <TabPanel value="3">
                    <Box mx="145px" display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                            <IconInfoCircleFilled size={24} />
                            Funcionalidade disponível em breve!
                        </Typography>
                    </Box>
                </TabPanel>
            </TabContext>
        </Box>
    );
}
