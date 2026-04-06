import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { Frequencia } from "./frequencia";
import type { Encontro } from "@/modules/celulas/domain/encontro";

const STYLE_TAB = {
    fontSize: { xs: "14px", md: "16px" },
    fontWeight: "500",
    width: { xs: "auto", md: "180px" },
    minWidth: "unset",
    padding: { xs: 1.5, md: 2.5 },
    color: "text.secondary",
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
            paddingTop="10px"
            marginX="auto"
            sx={{
                width: "100%",
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
                                backgroundColor: "#5E79B3",
                                borderRadius: "1.5px",
                            },
                        }}
                    >
                        <Tab label="Frequência" value="1" sx={STYLE_TAB} />
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
            </TabContext>
        </Box>
    );
}
