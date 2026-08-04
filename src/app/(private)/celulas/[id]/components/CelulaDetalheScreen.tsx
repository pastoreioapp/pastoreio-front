"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  IconArrowLeft,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { enqueueSnackbar } from "notistack";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import { useCelulaDetalhe } from "../hooks/useCelulaDetalhe";

const PAGE_SIZE = 10;

const emBreve = () =>
  enqueueSnackbar("Funcionalidade disponível em breve!", {
    variant: "info",
    autoHideDuration: 2000,
  });

function displayValue(value: string | null | undefined): string {
  if (value == null || value.trim() === "") return "—";
  return value;
}

function StatusBadge({ ativa }: { ativa: boolean }) {
  return (
    <Chip
      label={ativa ? "Ativa" : "Inativa"}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: "0.75rem",
        bgcolor: ativa ? "rgba(46, 125, 50, 0.12)" : "rgba(211, 47, 47, 0.12)",
        color: ativa ? "#2E7D32" : "#C62828",
        borderRadius: 2,
      }}
    />
  );
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.8rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "text.secondary",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: ".95rem", color: "#000" }}>
        {value}
      </Typography>
    </Box>
  );
}

function filterMembros(
  membros: MembroDaCelulaListItemDto[],
  search: string,
): MembroDaCelulaListItemDto[] {
  const termo = search.trim().toLowerCase();
  if (!termo) return membros;

  return membros.filter((membro) => {
    const campos = [
      membro.nome,
      membro.ministerio,
      membro.telefone,
      membro.email,
      membro.dataNascimento,
      membro.estadoCivil,
      membro.conjuge,
      membro.discipulador,
    ];
    return campos.some(
      (campo) => campo != null && campo.toLowerCase().includes(termo),
    );
  });
}

type Props = {
  celulaId: number;
};

export function CelulaDetalheScreen({ celulaId }: Props) {
  const router = useRouter();
  const { celula, membros, loading, erro } = useCelulaDetalhe(celulaId);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtrados = useMemo(
    () => filterMembros(membros, search),
    [membros, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaAtual = Math.min(page, totalPages);
  const inicio = (paginaAtual - 1) * PAGE_SIZE;
  const paginaItens = filtrados.slice(inicio, inicio + PAGE_SIZE);

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingBox />
      </Box>
    );
  }

  if (erro || !celula) {
    return (
      <Box sx={{ flex: 1 }}>
        <Button
          startIcon={<IconArrowLeft size={18} />}
          onClick={() => router.push("/celulas")}
          sx={{
            mb: 2,
            textTransform: "none",
            color: "#5E79B3",
          }}
        >
          Voltar
        </Button>
        <ErrorBox message={erro ?? "Célula não encontrada"} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Button
        startIcon={<IconArrowLeft size={18} />}
        onClick={() => router.push("/celulas")}
        sx={{
          alignSelf: "flex-start",
          mb: 2,
          textTransform: "none",
          color: "#5E79B3",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        Voltar para listagem
      </Button>

      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "1.25rem", md: "1.5rem" },
          fontWeight: 700,
          color: "#000",
          mb: 2,
          flexShrink: 0,
        }}
      >
        {celula.nome}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 2.5,
          bgcolor: "#FAFBFC",
          mb: 3,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "text.secondary",
            mb: 2,
          }}
        >
          Informações da célula
        </Typography>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Líder" value={displayValue(celula.liderNome)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Rede" value={displayValue(celula.rede)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Status" value={<StatusBadge ativa={celula.ativa} />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Membros" value={String(celula.totalMembros)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Dia da semana" value={displayValue(celula.diaSemana)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Horário" value={displayValue(celula.horario)} />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <InfoItem label="Local" value={displayValue(celula.local)} />
          </Grid>
        </Grid>
      </Paper>

      <Typography
        sx={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "#000",
          mb: 2,
          flexShrink: 0,
        }}
      >
        Membros da célula
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 2, flexShrink: 0 }}
      >
        <TextField
          variant="outlined"
          placeholder="Pesquisar membros"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", md: 240 },
            "& .MuiOutlinedInput-root": {
              height: 40,
              backgroundColor: "#F8F8F8",
              borderRadius: 2,
              "& fieldset": { borderColor: "#F5F5F5" },
              "&:hover fieldset": { borderColor: "#E0E0E0" },
              "&.Mui-focused fieldset": { borderColor: "#5E79B3" },
              "& .MuiInputBase-input::placeholder": {
                color: "#929EAE",
                opacity: 1,
                fontSize: ".9rem",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ width: 24, height: 24, color: "#929EAE" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          onClick={emBreve}
          sx={{
            height: 40,
            px: 2.5,
            borderRadius: 2,
            bgcolor: "#5E79B3",
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "#4A6499" },
          }}
        >
          Cadastrar Novo Membro
        </Button>
      </Stack>

      <TableContainer sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              {[
                "Nome",
                "Ministério",
                "Telefone",
                "Email",
                "Data Nascimento",
                "Estado Civil",
                "Cônjuge",
                "Discipulador",
                "Ações",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    borderBottom: "1px solid #ECECEC",
                    whiteSpace: "nowrap",
                    bgcolor: "#F8F8F8",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginaItens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    Nenhum membro encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginaItens.map((membro) => (
                <TableRow
                  key={membro.vinculoId}
                  hover
                  sx={{ "& td": { borderBottom: "1px solid #ECECEC" } }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#000" }}>
                    {displayValue(membro.nome)}
                  </TableCell>
                  <TableCell>{displayValue(membro.ministerio)}</TableCell>
                  <TableCell>{displayValue(membro.telefone)}</TableCell>
                  <TableCell>{displayValue(membro.email)}</TableCell>
                  <TableCell>{displayValue(membro.dataNascimento)}</TableCell>
                  <TableCell>{displayValue(membro.estadoCivil)}</TableCell>
                  <TableCell>{displayValue(membro.conjuge)}</TableCell>
                  <TableCell>{displayValue(membro.discipulador)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.75}>
                      <IconButton
                        size="small"
                        onClick={emBreve}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1.5,
                          bgcolor: "#5E79B3",
                          color: "#fff",
                          "&:hover": { bgcolor: "#4A6499" },
                        }}
                      >
                        <IconPencil size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={emBreve}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1.5,
                          bgcolor: "#D32F2F",
                          color: "#fff",
                          "&:hover": { bgcolor: "#B71C1C" },
                        }}
                      >
                        <IconTrash size={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "auto",
          pt: 3,
          flexShrink: 0,
        }}
      >
        <Pagination
          count={totalPages}
          page={paginaAtual}
          onChange={(_, value) => setPage(value)}
          showFirstButton
          showLastButton
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 1.5,
            },
            "& .Mui-selected": {
              bgcolor: "#5E79B3 !important",
              color: "#fff",
            },
          }}
        />
      </Box>
    </Box>
  );
}
