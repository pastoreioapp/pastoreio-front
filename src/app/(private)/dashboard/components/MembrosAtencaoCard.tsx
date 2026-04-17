import { Box, Typography } from "@mui/material";
import {
    MembroAtencaoEmpty,
    MembroAtencaoItem,
} from "./MembroAtencaoItem";
import type { MembroAtencao, Severidade } from "./MembroAtencaoItem";
import { CARD_STYLE, DANGER } from "../lib/tokens";

type Props = {
    membros: MembroAtencao[];
    onVerFicha?: (id: string) => void;
    onEnviarMensagem?: (id: string) => void;
    onRegistrarPastoreio?: (id: string) => void;
    onMarcarAcompanhado?: (id: string) => void;
    onAdiar?: (id: string) => void;
};

const SEVERIDADE_PESO: Record<Severidade, number> = {
    critico: 3,
    alerta: 2,
    observacao: 1,
};

function contarCriticos(membros: MembroAtencao[]): number {
    return membros.filter((m) => m.severidade === "critico").length;
}

function ordenarPorSeveridade(membros: MembroAtencao[]): MembroAtencao[] {
    return [...membros].sort(
        (a, b) => SEVERIDADE_PESO[b.severidade] - SEVERIDADE_PESO[a.severidade]
    );
}

export function MembrosAtencaoCard({
    membros,
    onVerFicha,
    onEnviarMensagem,
    onRegistrarPastoreio,
    onMarcarAcompanhado,
    onAdiar,
}: Props) {
    const ordenados = ordenarPorSeveridade(membros);
    const criticos = contarCriticos(membros);
    const headerId = "membros-atencao-titulo";

    return (
        <Box
            component="section"
            aria-labelledby={headerId}
            sx={{
                ...CARD_STYLE,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
            }}
        >
            <Box>
                <Typography
                    id={headerId}
                    component="h2"
                    sx={{
                        fontSize: { xs: "1.05rem", md: "1.2rem" },
                        fontWeight: 600,
                        color: "#2F323A",
                        lineHeight: 1.3,
                    }}
                >
                    Membros que precisam de atenção
                </Typography>
                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: "0.8rem",
                        color: "text.secondary",
                    }}
                >
                    {membros.length === 0
                        ? "Foque aqui primeiro para cuidar da sua célula"
                        : `${membros.length} ${membros.length === 1 ? "membro precisa" : "membros precisam"} de atenção`}
                    {criticos > 0 && (
                        <Typography
                            component="span"
                            sx={{ fontSize: "0.8rem", color: DANGER, fontWeight: 600 }}
                        >
                            {" "}({criticos} {criticos === 1 ? "crítico" : "críticos"})
                        </Typography>
                    )}
                </Typography>
            </Box>

            {membros.length === 0 ? (
                <MembroAtencaoEmpty />
            ) : (
                <Box
                    component="ul"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        m: 0,
                        p: 0,
                        listStyle: "none",
                    }}
                >
                    {ordenados.map((membro, i) => (
                        <MembroAtencaoItem
                            key={membro.id}
                            membro={membro}
                            index={i}
                            onVerFicha={onVerFicha}
                            onEnviarMensagem={onEnviarMensagem}
                            onRegistrarPastoreio={onRegistrarPastoreio}
                            onMarcarAcompanhado={onMarcarAcompanhado}
                            onAdiar={onAdiar}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
