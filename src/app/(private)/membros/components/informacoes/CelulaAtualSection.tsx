import { Box, Paper, Typography } from "@mui/material";
import type { CelulaAtualDto } from "@/modules/celulas/application/dtos";
import { formatarDataCompleta } from "@/ui/utils/datas";
import { getFuncaoLabel } from "../../lib/getFuncaoLabel";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";

type Props = {
    celulaAtual: CelulaAtualDto | null;
    loading: boolean;
    erro: string | null;
};

export function CelulaAtualSection({ celulaAtual, loading, erro }: Props) {
    if (loading) return <LoadingBox />;
    if (erro) return <ErrorBox message={erro} />;

    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3,
                p: 2.5,
                bgcolor: "#FAFBFC",
                width: "100%",
            }}
        >
            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 2,
                }}
            >
                Célula atual
            </Typography>

            {!celulaAtual ? (
                <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                    Nenhum vínculo ativo encontrado.
                </Typography>
            ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Campo label="Célula" valor={celulaAtual.celulaNome} />
                    <Campo label="Papel" valor={getFuncaoLabel(celulaAtual.papelCelula)} />
                    <Campo
                        label="Entrada"
                        valor={
                            celulaAtual.dataEntrada
                                ? formatarDataCompleta(celulaAtual.dataEntrada)
                                : null
                        }
                    />
                </Box>
            )}
        </Paper>
    );
}

function Campo({ label, valor }: { label: string; valor: string | null }) {
    return (
        <Box sx={{ flex: "1 1 140px", minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: ".9rem", color: valor ? "#000" : "text.disabled", mt: 0.5 }}>
                {valor || "—"}
            </Typography>
        </Box>
    );
}
