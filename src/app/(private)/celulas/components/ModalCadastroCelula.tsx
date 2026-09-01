"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import { enqueueSnackbar } from "notistack";
import { listMembrosDisponiveisParaLiderar } from "@/app/actions/celulas";
import type { CreateCelulaDto } from "@/modules/celulas/application/dtos";
import { DIAS_SEMANA } from "@/modules/celulas/domain/dia-semana";
import { REDES_CELULA } from "@/modules/celulas/domain/rede-celula";
import type { MembroListItemDto } from "@/modules/secretaria/application/dtos";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateCelulaDto) => Promise<void>;
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

const selectMenuProps = {
  PaperProps: {
    sx: {
      borderRadius: 2,
      mt: 0.5,
      boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.04)",
      "& .MuiMenuItem-root": {
        fontSize: "0.9rem",
        "&.Mui-selected": {
          bgcolor: "rgba(94, 121, 179, 0.1)",
        },
        "&.Mui-selected:hover": {
          bgcolor: "rgba(94, 121, 179, 0.1)",
        },
        "&:hover": {
          bgcolor: "rgba(94, 121, 179, 0.06)",
        },
      },
    },
  },
} as const;

const listboxSx = {
  maxHeight: 240,
  py: 0.5,
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#C9C9C9",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-track": { backgroundColor: "#F5F5F5" },
} as const;

const formInicial = {
  nome: "",
  rede: "",
  liderMembroId: "",
  diaSemana: "",
  horario: "",
  local: "",
  ativa: "true",
};

export function ModalCadastroCelula({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState(formInicial);
  const [membros, setMembros] = useState<MembroListItemDto[]>([]);
  const [carregandoMembros, setCarregandoMembros] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(formInicial);
      setSalvando(false);
      return;
    }

    let ativo = true;

    async function carregarMembros() {
      try {
        setCarregandoMembros(true);
        const data = await listMembrosDisponiveisParaLiderar();
        if (!ativo) return;
        setMembros(data);
      } catch (error: unknown) {
        if (!ativo) return;
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Erro ao carregar membros",
          { variant: "error", autoHideDuration: 3000 },
        );
      } finally {
        if (ativo) setCarregandoMembros(false);
      }
    }

    void carregarMembros();

    return () => {
      ativo = false;
    };
  }, [open]);

  const membrosOrdenados = useMemo(() => {
    const unicos = new Map<number, MembroListItemDto>();
    for (const membro of membros) {
      unicos.set(membro.id, membro);
    }

    return [...unicos.values()].sort((a, b) =>
      (a.nome ?? "").localeCompare(b.nome ?? "", "pt-BR"),
    );
  }, [membros]);

  const liderSelecionado = useMemo(
    () =>
      membrosOrdenados.find((membro) => String(membro.id) === form.liderMembroId) ??
      null,
    [form.liderMembroId, membrosOrdenados],
  );

  const atualizarCampo = (campo: keyof typeof form, valor: string) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  };

  const handleSubmit = async () => {
    if (!form.nome.trim()) {
      enqueueSnackbar("Informe o nome da célula.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return;
    }

    if (!form.rede) {
      enqueueSnackbar("Informe a rede da célula.", {
        variant: "error",
        autoHideDuration: 2500,
      });
      return;
    }

    const liderMembroId = form.liderMembroId
      ? Number(form.liderMembroId)
      : null;

    try {
      setSalvando(true);
      await onSave({
        nome: form.nome,
        rede: form.rede,
        liderMembroId,
        diaSemana: form.diaSemana || null,
        horario: form.horario || null,
        local: form.local || null,
        ativa: form.ativa === "true",
      });
    } catch (error: unknown) {
      enqueueSnackbar(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a célula.",
        { variant: "error", autoHideDuration: 3000 },
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={salvando ? undefined : onClose}
      fullWidth
      maxWidth="sm"
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
            Nova célula
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.82)" }}>
            Preencha os dados para cadastrar uma nova célula.
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={salvando}
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
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Nome da célula"
            value={form.nome}
            onChange={(event) => atualizarCampo("nome", event.target.value)}
            fullWidth
            required
            sx={{ ...inputSx, gridColumn: { xs: "1", sm: "1 / -1" } }}
          />

          <TextField
            label="Rede"
            value={form.rede}
            onChange={(event) => atualizarCampo("rede", event.target.value)}
            fullWidth
            select
            required
            SelectProps={{ MenuProps: selectMenuProps }}
            sx={inputSx}
          >
            {REDES_CELULA.map((rede) => (
              <MenuItem key={rede} value={rede}>
                {rede}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            options={membrosOrdenados}
            value={liderSelecionado}
            onChange={(_, membro) =>
              atualizarCampo("liderMembroId", membro ? String(membro.id) : "")
            }
            getOptionLabel={(membro) => membro.nome ?? `Membro #${membro.id}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(options, { inputValue }) => {
              const termo = inputValue.trim().toLowerCase();
              if (!termo) return options;
              return options.filter((membro) => {
                const nome = (membro.nome ?? "").toLowerCase();
                const email = (membro.email ?? "").toLowerCase();
                return nome.includes(termo) || email.includes(termo);
              });
            }}
            loading={carregandoMembros}
            disabled={carregandoMembros}
            noOptionsText="Nenhum membro disponível para liderar"
            loadingText="Carregando membros..."
            clearText="Limpar"
            openText="Abrir"
            closeText="Fechar"
            ListboxProps={{ sx: listboxSx }}
            componentsProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                  mt: 0.5,
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.04)",
                },
              },
            }}
            renderOption={(props, membro) => {
              const nome = membro.nome ?? `Membro #${membro.id}`;
              return (
                <Box
                  component="li"
                  {...props}
                  key={membro.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1,
                    px: 1.5,
                  }}
                >
                  <Avatar
                    src={membro.avatarUrl ?? undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#5E79B3",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {nome.trim().charAt(0).toUpperCase() || "?"}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#000",
                        lineHeight: 1.3,
                      }}
                    >
                      {nome}
                    </Typography>
                    {membro.email ? (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.secondary",
                          lineHeight: 1.3,
                        }}
                      >
                        {membro.email}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Líder"
                placeholder="Pesquisar membro"
                sx={inputSx}
              />
            )}
          />

          <TextField
            label="Dia da semana"
            value={form.diaSemana}
            onChange={(event) => atualizarCampo("diaSemana", event.target.value)}
            fullWidth
            select
            SelectProps={{ MenuProps: selectMenuProps }}
            sx={inputSx}
          >
            <MenuItem value="">Não informado</MenuItem>
            {DIAS_SEMANA.map((dia) => (
              <MenuItem key={dia} value={dia}>
                {dia}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Horário"
            type="time"
            value={form.horario}
            onChange={(event) => atualizarCampo("horario", event.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />

          <TextField
            label="Local"
            value={form.local}
            onChange={(event) => atualizarCampo("local", event.target.value)}
            fullWidth
            sx={{ ...inputSx, gridColumn: { xs: "1", sm: "1 / -1" } }}
          />

          <TextField
            label="Status"
            value={form.ativa}
            onChange={(event) => atualizarCampo("ativa", event.target.value)}
            fullWidth
            select
            SelectProps={{ MenuProps: selectMenuProps }}
            sx={inputSx}
          >
            <MenuItem value="true">Ativa</MenuItem>
            <MenuItem value="false">Inativa</MenuItem>
          </TextField>
        </Box>
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
          onClick={() => void handleSubmit()}
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
          {salvando ? "Salvando..." : "Criar célula"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
