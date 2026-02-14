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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export function Frequencia({ data }: { data: Encontro["frequencia"] }) {
    const getIcon = (situacao: string) => {
        switch (situacao) {
            case "presente":
            case "justificado":
                return (
                    <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />
                );
            case "faltou":
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

    return (
        <TableContainer
            component={Paper}
            sx={{ width: 350, boxShadow: "none", border: "none" }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow
                        sx={{
                            borderBottom: "1px solid #E7E7E7",
                            p: "11px",
                        }}
                    >
                        <TableCell align="left" sx={{ borderBottom: "none" }}>
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                sx={{ color: "#959595" }}
                            >
                                Membro
                            </Typography>
                        </TableCell>
                        <TableCell align="left" sx={{ borderBottom: "none" }}>
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                sx={{ color: "#959595" }}
                            >
                                Situação
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, i) => (
                        <TableRow
                            key={i}
                            sx={{
                                borderBottom: "1px solid #E7E7E7",
                                p: "11px",
                            }}
                        >
                            <TableCell
                                align="left"
                                sx={{ borderBottom: "none" }}
                            >
                                <Typography fontSize={13}>
                                    {item.nome}
                                </Typography>
                            </TableCell>
                            <TableCell
                                align="left"
                                sx={{ borderBottom: "none" }}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={0.5}
                                >
                                    {getIcon(item.situacao)}
                                    <Typography fontSize={13}>
                                        {item.situacao}
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
