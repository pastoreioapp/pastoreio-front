"use client";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import PageContainer from "@/ui/components/pages/PageContainer";
import { OrganogramaFlow } from "./components/OrganogramaFlow";
import { useOrganograma } from "./hooks/useOrganograma";

export default function Orgonograma() {
    const { nodes, edges, loading, error, isEmpty } = useOrganograma();

    return (
        <PageContainer
            title="Organograma"
            description="Organograma da célula"
        >
            <Box
                className="bg-white rounded-xl shadow-lg border px-4 py-3"
                sx={{ width: "100%", height: 1000 }}
            >
                {loading ? (
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : null}

                {!loading && error ? (
                    <Alert severity="error">{error}</Alert>
                ) : null}

                {!loading && !error && isEmpty ? (
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography color="text.secondary">
                            Nenhum membro disponivel para exibir no organograma.
                        </Typography>
                    </Box>
                ) : null}

                {!loading && !error && !isEmpty ? (
                    <OrganogramaFlow nodes={nodes} edges={edges} />
                ) : null}
            </Box>
        </PageContainer>
    );
}
