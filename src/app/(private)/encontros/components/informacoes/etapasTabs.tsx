import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { Frequencia } from "./frequencia";
import type { Encontro } from "@/modules/celulas/domain/encontro";

const STYLE_TAB = {
    fontSize: "16px",
    fontWeight: "500",
    width: "180px",
    color: "#C5C5C5",
    "&.Mui-selected": {
        color: "#000",
    },
};

export function EtapasTabs({ data }: { data: Encontro["frequencia"] }) {
    const [tab, setTab] = useState("1");

    return (
        <Box
            display="flex"
            flexDirection="column"
            paddingTop="50px"
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
                        <Tab label="Frequência" value="1" sx={STYLE_TAB} />
                        <Tab label="Materiais" value="2" sx={STYLE_TAB} />
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
                        <Frequencia data={data} />
                    </Box>
                </TabPanel>
                <TabPanel value="2">
                    <Box>Materiais</Box>
                </TabPanel>
            </TabContext>
        </Box>
    );
}
