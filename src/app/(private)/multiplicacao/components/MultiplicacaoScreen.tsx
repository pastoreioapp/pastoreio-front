"use client";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { IconPlus, IconTrash, IconUsersGroup } from "@tabler/icons-react";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useAppAuthentication } from "@/ui/hooks/useAppAuthentication";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import type { CreateMultiplicacaoDto } from "@/modules/multiplicacao/application/dtos";
import type { StatusMultiplicacao } from "@/modules/multiplicacao/domain/status-multiplicacao";
import { createMultiplicacao, deleteMultiplicacao } from "@/app/actions/multiplicacao";
import { useMultiplicacao } from "../hooks/useMultiplicacao";
import { ModalCadastroMultiplicacao } from "./ModalCadastroMultiplicacao";

const STATUS_LABEL: Record<StatusMultiplicacao, string> = {
  PLANEJADA: "Planejada",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluida",
  CANCELADA: "Cancelada",
};

const STATUS_COLOR: Record<StatusMultiplicacao, "default" | "info" | "success" | "error"> = {
  PLANEJADA: "default",
  EM_ANDAMENTO: "info",
  CONCLUIDA: "success",
  CANCELADA: "error",
};

export function MultiplicacaoScreen() {
  const { loggedUser } = useAppAuthentication();
  const celulaId = loggedUser?.celulaId;
  const { membros, multiplicacoes, loading, erro, refetch } =
    useMultiplicacao(celulaId);
  const [modalAberto, setModalAberto] = useState(false);
  const [multiplicacaoExcluindoId, setMultiplicacaoExcluindoId] = useState<
    number | null
  >(null);
  const [excluindo, setExcluindo] = useState(false);

  const handleSave = async (payload: CreateMultiplicacaoDto) => {
    const result = await createMultiplicacao(payload);

    if (!result.ok) {
      enqueueSnackbar(result.error, {
        variant: "error",
        autoHideDuration: 4000,
      });
      return;
    }

    enqueueSnackbar("Multiplicacao registrada com sucesso.", {
      variant: "success",
      autoHideDuration: 2500,
    });
    setModalAberto(false);
    refetch();
  };

  const handleConfirmarExcluir = async () => {
    if (celulaId == null || multiplicacaoExcluindoId == null) return;

    try {
      setExcluindo(true);
      await deleteMultiplicacao(multiplicacaoExcluindoId, celulaId);
      enqueueSnackbar("Multiplicacao excluida com sucesso.", {
        variant: "success",
        autoHideDuration: 2500,
      });
      setMultiplicacaoExcluindoId(null);
      await refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir a multiplicacao.";
      enqueueSnackbar(message, { variant: "error", autoHideDuration: 4000 });
    } finally {
      setExcluindo(false);
    }
  };

  if (loading) {
    return <LoadingBox />;
  }

  if (erro) {
    return <ErrorBox message={erro} />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, color: "#111827" }}>
            Multiplicacao da celula
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mt: 0.5 }}>
            Selecione membros da celula atual e registre a formacao de uma nova celula.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          onClick={() => setModalAberto(true)}
          disabled={membros.length === 0 || celulaId == null}
          sx={{
            bgcolor: "#5E79B3",
            "&:hover": { bgcolor: "#4A6499" },
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
            px: 2.5,
            flexShrink: 0,
          }}
        >
          Nova multiplicacao
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <ResumoCard label="Membros na celula" value={membros.length} />
        <ResumoCard label="Multiplicacoes registradas" value={multiplicacoes.length} />
        <ResumoCard
          label="Membros em processo"
          value={multiplicacoes.reduce((total, item) => total + item.totalMembros, 0)}
        />
      </Box>

      {multiplicacoes.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: "#ECECEC",
            p: { xs: 3, md: 4 },
            textAlign: "center",
            bgcolor: "#FAFBFC",
          }}
        >
          <IconUsersGroup size={44} stroke={1.5} color="#5E79B3" />
          <Typography sx={{ mt: 1.5, fontWeight: 700, color: "#111827" }}>
            Nenhuma multiplicacao registrada
          </Typography>
          <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: "0.9rem" }}>
            Comece escolhendo os membros que farao parte da nova celula.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {multiplicacoes.map((multiplicacao) => {
            const membrosRestantes = Math.max(
              membros.length - multiplicacao.totalMembros,
              0,
            );
            const percentual =
              membros.length > 0
                ? Math.round((multiplicacao.totalMembros / membros.length) * 100)
                : 0;

            return (
              <Paper
                key={multiplicacao.id}
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: "#ECECEC", p: 2.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                      <Typography sx={{ fontWeight: 800, color: "#111827" }}>
                        {multiplicacao.celulaDestinoNome ??
                          "Nova celula planejada"}
                      </Typography>
                      <Chip
                        size="small"
                        color={STATUS_COLOR[multiplicacao.statusMultiplicacao]}
                        label={STATUS_LABEL[multiplicacao.statusMultiplicacao]}
                      />
                    </Stack>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.86rem", mt: 0.5 }}>
                      Data prevista: {formatDate(multiplicacao.dataMultiplicacao)}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.86rem", mt: 0.25 }}>
                      Lider: {multiplicacao.liderNome ?? "Nao informado"}
                    </Typography>
                  </Box>

                  <Box sx={{ minWidth: { md: 220 } }}>
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 0.75 }}>
                      {multiplicacao.totalMembros} vao para a nova celula, {membrosRestantes} permanecem
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentual, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        bgcolor: "#EEF2F7",
                        "& .MuiLinearProgress-bar": { bgcolor: "#5E79B3" },
                      }}
                    />
                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      startIcon={<IconTrash size={16} />}
                      onClick={() => setMultiplicacaoExcluindoId(multiplicacao.id)}
                      sx={{
                        mt: 1.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      Excluir
                    </Button>
                  </Box>
                </Box>

                {multiplicacao.observacoes && (
                  <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", mt: 1.5 }}>
                    {multiplicacao.observacoes}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {multiplicacao.membros.map((membro) => (
                    <Chip
                      key={membro.id}
                      avatar={<Avatar>{getInitial(membro.nome)}</Avatar>}
                      label={membro.nome ?? `Membro #${membro.membroId}`}
                      variant="outlined"
                      color={membro.liderNovaCelula ? "primary" : "default"}
                      sx={{ borderColor: "#E5E7EB", maxWidth: "100%" }}
                    />
                  ))}
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}

      <ModalCadastroMultiplicacao
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={handleSave}
        celulaId={celulaId}
        membros={membros}
      />

      <Dialog
        open={multiplicacaoExcluindoId != null}
        onClose={() => {
          if (!excluindo) setMultiplicacaoExcluindoId(null);
        }}
        aria-labelledby="dialog-excluir-multiplicacao-titulo"
      >
        <DialogTitle id="dialog-excluir-multiplicacao-titulo">
          Excluir multiplicacao
        </DialogTitle>
        <DialogContent>
          A multiplicacao, os membros vinculados e a celula criada por ela serao
          marcados como excluidos.
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            color="inherit"
            disabled={excluindo}
            onClick={() => setMultiplicacaoExcluindoId(null)}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={excluindo}
            onClick={() => void handleConfirmarExcluir()}
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ResumoCard({ label, value }: { label: string; value: number }) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, borderColor: "#ECECEC", p: 2, bgcolor: "#FAFBFC" }}
    >
      <Typography sx={{ color: "text.secondary", fontSize: "0.78rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#111827", fontSize: "1.7rem", fontWeight: 800, mt: 0.5 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Nao informada";
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function getInitial(nome: string | null) {
  return (nome?.trim()[0] ?? "?").toUpperCase();
}
