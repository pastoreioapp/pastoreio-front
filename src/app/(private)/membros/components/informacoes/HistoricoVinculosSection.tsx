import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import type { VinculoHistoricoDto } from "@/modules/celulas/application/dtos";
import { formatarDataCompleta } from "@/ui/utils/datas";
import { getFuncaoLabel } from "../../lib/getFuncaoLabel";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";

type Props = {
    historico: VinculoHistoricoDto[];
    loading: boolean;
    erro: string | null;
};

export function HistoricoVinculosSection({ historico, loading, erro }: Props) {
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
                Histórico de vínculos
            </Typography>

            {historico.length === 0 ? (
                <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                    Nenhum vínculo registrado.
                </Typography>
            ) : (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Célula</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Papel</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Entrada</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Saída</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historico.map((vinculo) => (
                                <TableRow key={vinculo.vinculoId}>
                                    <TableCell>{vinculo.celulaNome}</TableCell>
                                    <TableCell>{getFuncaoLabel(vinculo.papelCelula)}</TableCell>
                                    <TableCell>
                                        {vinculo.dataEntrada
                                            ? formatarDataCompleta(vinculo.dataEntrada)
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        {vinculo.dataSaida
                                            ? formatarDataCompleta(vinculo.dataSaida)
                                            : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}
