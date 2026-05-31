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
import type {
  CreateMultiplicacaoDto,
  MultiplicacaoListItemDto,
} from "@/modules/multiplicacao/application/dtos";
import { StatusMultiplicacao } from "@/modules/multiplicacao/domain/status-multiplicacao";
import {
  createMultiplicacao,
  deleteMultiplicacao,
  finalizarMultiplicacao,
  solicitarAnaliseMultiplicacao,
  updateMultiplicacao,
} from "@/app/actions/multiplicacao";
import { useMultiplicacao } from "../hooks/useMultiplicacao";
import { ModalCadastroMultiplicacao } from "./ModalCadastroMultiplicacao";

const STATUS_LABEL: Record<StatusMultiplicacao, string> = {
  [StatusMultiplicacao.EM_PLANEJAMENTO]: "Em planejamento",
  [StatusMultiplicacao.EM_ANALISE]: "Em análise",
  [StatusMultiplicacao.AUTORIZADA]: "Autorizada",
  [StatusMultiplicacao.FINALIZADA]: "Finalizada",
};

const STATUS_STEPS = [
  StatusMultiplicacao.EM_PLANEJAMENTO,
  StatusMultiplicacao.EM_ANALISE,
  StatusMultiplicacao.AUTORIZADA,
  StatusMultiplicacao.FINALIZADA,
] as const;

export function MultiplicacaoScreen() {
  const { loggedUser } = useAppAuthentication();
  const celulaId = loggedUser?.celulaId;
  const { membros, multiplicacoes, loading, erro, refetch } =
    useMultiplicacao(celulaId);
  const [modalAberto, setModalAberto] = useState(false);
  const [multiplicacaoEditando, setMultiplicacaoEditando] =
    useState<MultiplicacaoListItemDto | null>(null);
  const [multiplicacaoExcluindoId, setMultiplicacaoExcluindoId] = useState<
    number | null
  >(null);
  const [excluindo, setExcluindo] = useState(false);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const handleSave = async (payload: CreateMultiplicacaoDto) => {
    try {
      if (multiplicacaoEditando) {
        await updateMultiplicacao({ ...payload, id: multiplicacaoEditando.id });
      } else {
        await createMultiplicacao(payload);
      }

      enqueueSnackbar(
        multiplicacaoEditando
          ? "Multiplicacao atualizada com sucesso."
          : "Multiplicacao registrada com sucesso.",
        {
          variant: "success",
          autoHideDuration: 2500,
        },
      );
      setModalAberto(false);
      setMultiplicacaoEditando(null);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar a multiplicacao.";
      enqueueSnackbar(message, { variant: "error", autoHideDuration: 4000 });
    }
  };

  const handleSolicitarAnalise = async (multiplicacaoId: number) => {
    if (celulaId == null) return;

    try {
      setProcessandoId(multiplicacaoId);
      await solicitarAnaliseMultiplicacao(multiplicacaoId, celulaId);
      enqueueSnackbar("Multiplicacao enviada para analise.", {
        variant: "success",
        autoHideDuration: 2500,
      });
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel solicitar analise.";
      enqueueSnackbar(message, { variant: "error", autoHideDuration: 4000 });
    } finally {
      setProcessandoId(null);
    }
  };

  const handleFinalizar = async (multiplicacaoId: number) => {
    if (celulaId == null) return;

    try {
      setProcessandoId(multiplicacaoId);
      await finalizarMultiplicacao(multiplicacaoId, celulaId);
      enqueueSnackbar("Multiplicacao finalizada e nova celula criada.", {
        variant: "success",
        autoHideDuration: 2500,
      });
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel finalizar a multiplicacao.";
      enqueueSnackbar(message, { variant: "error", autoHideDuration: 4000 });
    } finally {
      setProcessandoId(null);
    }
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
          onClick={() => {
            setMultiplicacaoEditando(null);
            setModalAberto(true);
          }}
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
                    <Typography sx={{ fontWeight: 800, color: "#111827" }}>
                      {multiplicacao.celulaDestinoNome ??
                        multiplicacao.nomeCelulaDestino ??
                        "Nova celula planejada"}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.86rem", mt: 0.5 }}>
                      Data prevista: {formatDate(multiplicacao.dataMultiplicacao)}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.86rem", mt: 0.25 }}>
                      Lider: {multiplicacao.liderNome ?? "Nao informado"}
                    </Typography>
                  </Box>

                  <Box sx={{ minWidth: { md: 220 } }}>
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 0.75 }}>
                      {multiplicacao.totalMembros} vão para a nova célula, {membrosRestantes} permanecem
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
                    <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={
                          multiplicacao.statusMultiplicacao !==
                          StatusMultiplicacao.EM_PLANEJAMENTO
                        }
                        onClick={() => {
                          setMultiplicacaoEditando(multiplicacao);
                          setModalAberto(true);
                        }}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Editar
                      </Button>
                      {multiplicacao.statusMultiplicacao ===
                        StatusMultiplicacao.EM_PLANEJAMENTO && (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={processandoId === multiplicacao.id}
                          onClick={() => void handleSolicitarAnalise(multiplicacao.id)}
                          sx={{
                            bgcolor: "#5E79B3",
                            "&:hover": { bgcolor: "#4A6499" },
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                          }}
                        >
                          Solicitar análise
                        </Button>
                      )}
                      {multiplicacao.statusMultiplicacao ===
                        StatusMultiplicacao.AUTORIZADA && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={processandoId === multiplicacao.id}
                          onClick={() => void handleFinalizar(multiplicacao.id)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                          }}
                        >
                          Multiplicar
                        </Button>
                      )}
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        startIcon={<IconTrash size={16} />}
                        onClick={() => setMultiplicacaoExcluindoId(multiplicacao.id)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </Box>
                </Box>

                <StatusProgress status={multiplicacao.statusMultiplicacao} />

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
        onClose={() => {
          setModalAberto(false);
          setMultiplicacaoEditando(null);
        }}
        onSave={handleSave}
        celulaId={celulaId}
        membros={membros}
        multiplicacao={multiplicacaoEditando}
      />

      <Dialog
        open={multiplicacaoExcluindoId != null}
        onClose={() => {
          if (!excluindo) setMultiplicacaoExcluindoId(null);
        }}
        aria-labelledby="dialog-excluir-multiplicacao-titulo"
      >
        <DialogTitle id="dialog-excluir-multiplicacao-titulo">
          Excluir multiplicacão
        </DialogTitle>
        <DialogContent>
          O planejamento de multiplicação será excluído permanentemente
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

function StatusProgress({ status }: { status: StatusMultiplicacao }) {
  const activeIndex = Math.max(
    STATUS_STEPS.findIndex((step) => step === status),
    0,
  );

  return (
    <Box sx={{ mt: 2.5, mb: 0.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1.5, sm: 0 },
          position: "relative",
          "&::before": {
            content: { xs: "none", sm: '""' },
            position: "absolute",
            top: 18,
            left: "12.5%",
            right: "12.5%",
            height: 3,
            borderRadius: 999,
            bgcolor: "#E5E7EB",
          },
        }}
      >
        {STATUS_STEPS.map((step, index) => {
          const completed = index < activeIndex;
          const active = index === activeIndex;

          return (
            <Box
              key={step}
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  color: active ? "#111827" : "text.secondary",
                  fontSize: "0.76rem",
                  fontWeight: active ? 800 : 700,
                  lineHeight: 1.2,
                  minHeight: 28,
                  px: 0.5,
                }}
              >
                {STATUS_LABEL[step]}
              </Typography>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  mt: 0.75,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: completed || active ? "#22C55E" : "#D1D5DB",
                  color: "#fff",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  border: "3px solid #fff",
                  boxShadow: active
                    ? "0 0 0 3px rgba(34, 197, 94, 0.18)"
                    : "0 1px 3px rgba(17, 24, 39, 0.12)",
                }}
              >
                {completed ? "✓" : index + 1}
              </Box>
              <Box
                sx={{
                  mt: 0.75,
                  px: 1,
                  py: 0.35,
                  borderRadius: 1,
                  bgcolor: active
                    ? "#FEF3C7"
                    : completed
                      ? "#DCFCE7"
                      : "#F3F4F6",
                  color: active
                    ? "#92400E"
                    : completed
                      ? "#166534"
                      : "text.secondary",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {active ? "atual" : completed ? "concluida" : "pendente"}
              </Box>
            </Box>
          );
        })}
      </Box>
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
