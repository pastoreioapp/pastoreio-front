"use client";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type {
  CreateMultiplicacaoDto,
  MultiplicacaoListItemDto,
} from "@/modules/multiplicacao/application/dtos";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateMultiplicacaoDto) => Promise<void>;
  celulaId?: number | null;
  membros: MembroDaCelulaListItemDto[];
  multiplicacao?: MultiplicacaoListItemDto | null;
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F8F8F8",
    borderRadius: 2,
    "& fieldset": { borderColor: "#F5F5F5" },
    "&:hover fieldset": { borderColor: "#E0E0E0" },
    "&.Mui-focused fieldset": { borderColor: "#5E79B3" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#5E79B3" },
} as const;

export function ModalCadastroMultiplicacao({
  open,
  onClose,
  onSave,
  celulaId,
  membros,
  multiplicacao,
}: Props) {
  const [nomeCelulaDestino, setNomeCelulaDestino] = useState("");
  const [liderMembroId, setLiderMembroId] = useState("");
  const [dataMultiplicacao, setDataMultiplicacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) {
      setNomeCelulaDestino("");
      setLiderMembroId("");
      setDataMultiplicacao("");
      setObservacoes("");
      setBusca("");
      setSelecionados(new Set());
      setSalvando(false);
      return;
    }

    if (multiplicacao) {
      setNomeCelulaDestino(multiplicacao.nomeCelulaDestino ?? "");
      setLiderMembroId(
        multiplicacao.liderMembroId == null ? "" : String(multiplicacao.liderMembroId),
      );
      setDataMultiplicacao(multiplicacao.dataMultiplicacao ?? "");
      setObservacoes(multiplicacao.observacoes ?? "");
      setBusca("");
      setSelecionados(
        new Set(multiplicacao.membros.map((membro) => membro.membroId)),
      );
      setSalvando(false);
    }
  }, [multiplicacao, open]);

  const membrosVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return membros;
    return membros.filter((membro) =>
      (membro.nome ?? `#${membro.id}`).toLowerCase().includes(termo),
    );
  }, [busca, membros]);

  const totalSelecionados = selecionados.size;
  const totalPermanecem = Math.max(membros.length - totalSelecionados, 0);
  const membrosSelecionados = useMemo(
    () => membros.filter((membro) => selecionados.has(membro.id)),
    [membros, selecionados],
  );

  const toggleMembro = (membroId: number) => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(membroId)) next.delete(membroId);
      else next.add(membroId);

      if (!next.has(Number(liderMembroId))) {
        setLiderMembroId("");
      }

      return next;
    });
  };

  const handleSubmit = async () => {
    if (celulaId == null) {
      enqueueSnackbar("Celula de origem nao encontrada.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return;
    }

    if (!nomeCelulaDestino.trim()) {
      enqueueSnackbar("Informe o nome da nova celula.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return;
    }

    if (selecionados.size === 0) {
      enqueueSnackbar("Selecione pelo menos um membro.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return;
    }

    const liderId = Number(liderMembroId);
    if (!Number.isFinite(liderId) || !selecionados.has(liderId)) {
      enqueueSnackbar("Informe o lider da nova celula.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return;
    }

    try {
      setSalvando(true);
      await onSave({
        celulaOrigemId: celulaId,
        nomeCelulaDestino,
        liderMembroId: liderId,
        dataMultiplicacao: dataMultiplicacao || null,
        observacoes,
        membros: membrosSelecionados.map((membro) => ({
          membroId: membro.id,
          papelCelula: membro.funcao,
          liderNovaCelula: membro.id === liderId,
        })),
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel registrar a multiplicacao.";
      enqueueSnackbar(message, { variant: "error", autoHideDuration: 3000 });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <Box
        sx={{
          bgcolor: "#5E79B3",
          color: "#fff",
          px: { xs: 2, md: 3 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 800 }}>
            {multiplicacao ? "Editar multiplicacao" : "Nova multiplicacao"}
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.82)" }}>
            {totalSelecionados} selecionados, {totalPermanecem} permanecem na celula atual
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Fechar"
          sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.14)" } }}
        >
          <IconX size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 220px" },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="Nome da nova celula"
            value={nomeCelulaDestino}
            onChange={(event) => setNomeCelulaDestino(event.target.value)}
            fullWidth
            required
            sx={inputSx}
          />
          <TextField
            label="Data prevista"
            type="date"
            value={dataMultiplicacao}
            onChange={(event) => setDataMultiplicacao(event.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />
        </Box>

        <TextField
          label="Lider da nova celula"
          value={liderMembroId}
          onChange={(event) => setLiderMembroId(event.target.value)}
          fullWidth
          select
          required
          disabled={membrosSelecionados.length === 0}
          helperText={
            membrosSelecionados.length === 0
              ? "Selecione os membros antes de definir o lider."
              : "Escolha um dos membros que ira para a nova celula."
          }
          sx={{ ...inputSx, mb: 2 }}
        >
          {membrosSelecionados.map((membro) => (
            <MenuItem key={membro.id} value={String(membro.id)}>
              {membro.nome ?? `Membro #${membro.id}`}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Observacoes"
          value={observacoes}
          onChange={(event) => setObservacoes(event.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={inputSx}
        />

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            mb: 1.5,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#111827" }}>
              Membros da celula atual
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.86rem" }}>
              Marque quem fara parte da nova celula.
            </Typography>
          </Box>
          <TextField
            aria-label="Pesquisar membro"
            placeholder="Pesquisar membro"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            size="small"
            sx={{ ...inputSx, width: { xs: "100%", md: 280 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#929EAE" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: "#ECECEC",
            overflow: "hidden",
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          <List disablePadding>
            {membrosVisiveis.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="Nenhum membro encontrado."
                  primaryTypographyProps={{ color: "text.secondary", fontSize: "0.9rem" }}
                />
              </ListItem>
            ) : (
              membrosVisiveis.map((membro, index) => {
                const checked = selecionados.has(membro.id);
                const nome = membro.nome ?? `Membro #${membro.id}`;

                return (
                  <ListItemButton
                    key={membro.id}
                    onClick={() => toggleMembro(membro.id)}
                    sx={{
                      borderBottom:
                        index === membrosVisiveis.length - 1
                          ? "none"
                          : "1px solid #ECECEC",
                      bgcolor: checked ? "rgba(94, 121, 179, 0.06)" : "#fff",
                    }}
                  >
                    <Checkbox
                      edge="start"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{ color: "#5E79B3", "&.Mui-checked": { color: "#5E79B3" } }}
                    />
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#EEF2FF", color: "#5E79B3", fontWeight: 800 }}>
                        {nome.trim()[0]?.toUpperCase() ?? "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={nome}
                      secondary={membro.funcao ?? "MEMBRO"}
                      primaryTypographyProps={{ fontWeight: 700, color: "#111827" }}
                      secondaryTypographyProps={{ fontSize: "0.78rem" }}
                    />
                  </ListItemButton>
                );
              })
            )}
          </List>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid #ECECEC", px: 3, py: 2, gap: 1 }}>
        <Button
          color="inherit"
          onClick={onClose}
          disabled={salvando}
          sx={{ fontWeight: 700, textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={salvando}
          sx={{
            bgcolor: "#5E79B3",
            "&:hover": { bgcolor: "#4A6499" },
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
            px: 3,
          }}
        >
          {salvando
            ? "Salvando..."
            : multiplicacao
              ? "Salvar alteracoes"
              : "Registrar multiplicacao"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
