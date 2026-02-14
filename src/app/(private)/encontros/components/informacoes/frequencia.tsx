import type { Frequencia } from "@/modules/celulas/domain/frequencia";
import type { Encontro } from "@/modules/celulas/domain/encontro";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Box,
    Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

function getSituacao(item: Frequencia): "Presente" | "Justificado" | "Faltou" {
    if (item.presente) return "Presente";
    if (item.justificado) return "Justificado";
    return "Faltou";
}

type FrequenciaParaListagem = Frequencia & { membro_nome?: string };

export function Frequencia({ data }: { data: Encontro["frequencia"] }) {
    const getIcon = (situacao: "Presente" | "Justificado" | "Faltou") => {
        switch (situacao) {
            case "Presente":
                return (
                    <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />
                );
            case "Justificado":
                return (
                    <DoDisturbOnIcon sx={{ color: "orange", fontSize: 18 }} />
                );
            case "Faltou":
                return <CancelIcon sx={{ color: "red", fontSize: 18 }} />;
            default:
                return null;
        }
    };

    if (!data || data.length === 0) {
        return (
            <Typography fontSize={13} sx={{ color: "#959595" }}>
                Nenhum registro de frequência para este encontro.
            </Typography>
        );
    }

    const itens = data as FrequenciaParaListagem[];

    return (
        <TableContainer
            component={Paper}
            sx={{ width: "100%", boxShadow: "none", border: "none" }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow
                        sx={{
                            borderBottom: "1px solid #E7E7E7",
                            p: 2,
                        }}
                    >
                        <TableCell align="left" sx={{ borderBottom: "none", width: "70%" }}>
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                sx={{ color: "#959595", p: 1 }}
                            >
                                Membro
                            </Typography>
                        </TableCell>
                        <TableCell align="left" sx={{ borderBottom: "none", width: "30%" }}>
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                sx={{ color: "#959595", p: 1 }}
                            >
                                Situação
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {itens.map((item, i) => {
                        const situacao = getSituacao(item);
                        const nomeExibicao =
                            item.membro_nome ?? `Membro #${item.membro_id}`;
                        const tituloJustificativa =
                            item.justificado && item.justificativa
                                ? item.justificativa
                                : null;
                        return (
                            <TableRow
                                key={item.id ?? i}
                                sx={{
                                    borderBottom: "1px solid #E7E7E7",
                                    p: "11px",
                                }}
                            >
                                <TableCell
                                    align="left"
                                    sx={{ borderBottom: "none", p: 2 }}
                                >
                                    <Typography fontSize={15}>
                                        {nomeExibicao}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    align="left"
                                    sx={{ borderBottom: "none", p: 2 }}
                                >
                                    <Tooltip
                                        title={tituloJustificativa ?? ""}
                                        disableHoverListener={!tituloJustificativa}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={0.5}
                                        >
                                            {getIcon(situacao)}
                                            <Typography fontSize={15}>
                                                {situacao}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
