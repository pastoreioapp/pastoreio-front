"use client";

import {
    Alert,
    Box,
    CircularProgress,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import PageContainer from "@/ui/components/pages/PageContainer";
import { LIDER_AUXILIAR_ROLES } from "@/modules/controleacesso/domain/navigation";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { OrganogramaFlow } from "./components/OrganogramaFlow";
import { useOrganograma } from "./hooks/useOrganograma";

export default function Orgonograma() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const columnsPerLine = isMobile ? 2 : isTablet ? 3 : 4;
    const { loggedUser } = useAppAuthentication();
    const { nodes, edges, loading, error, isEmpty } = useOrganograma(
        columnsPerLine,
        loggedUser?.celulaId,
    );

    return (
        <PageContainer
            title="Organograma"
            description="Organograma da célula"
            allowedRoles={LIDER_AUXILIAR_ROLES}
        >
            <Box
                className="bg-white rounded-xl shadow-lg border px-4 py-3"
                sx={{ width: "100%", height: isMobile ? 700 : 1000 }}
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
