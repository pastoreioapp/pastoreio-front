"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
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
  IconEye,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import { enqueueSnackbar } from "notistack";
import { LoadingBox } from "@/ui/components/feedback/LoadingBox";
import { ErrorBox } from "@/ui/components/feedback/ErrorBox";
import { REDES_CELULA } from "@/modules/celulas/domain/rede-celula";
import type { CelulaListItemDto } from "@/modules/celulas/application/dtos";
import { useCelulas } from "../hooks/useCelulas";

const PAGE_SIZE = 10;
const TODOS = "Todos";

type StatusFiltro = typeof TODOS | "Ativa" | "Inativa";
type RedeFiltro = typeof TODOS | (typeof REDES_CELULA)[number];

const FILTER_SELECT_SX = {
  minWidth: { xs: "100%", sm: 160 },
  "& .MuiOutlinedInput-root": {
    height: 40,
    backgroundColor: "#F8F8F8",
    borderRadius: 2,
    "& fieldset": { borderColor: "#F5F5F5" },
    "&:hover fieldset": { borderColor: "#E0E0E0" },
    "&.Mui-focused fieldset": { borderColor: "#5E79B3" },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
  },
};

const emBreve = () =>
  enqueueSnackbar("Funcionalidade disponível em breve!", {
    variant: "info",
    autoHideDuration: 2000,
  });

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

function filterCelulas(
  celulas: CelulaListItemDto[],
  search: string,
  statusFiltro: StatusFiltro,
  redeFiltro: RedeFiltro,
): CelulaListItemDto[] {
  const termo = search.trim().toLowerCase();

  return celulas.filter((celula) => {
    const matchSearch =
      !termo ||
      celula.nome.toLowerCase().includes(termo) ||
      (celula.liderNome?.toLowerCase().includes(termo) ?? false) ||
      (celula.rede?.toLowerCase().includes(termo) ?? false);

    const matchStatus =
      statusFiltro === TODOS ||
      (statusFiltro === "Ativa" && celula.ativa) ||
      (statusFiltro === "Inativa" && !celula.ativa);

    const matchRede =
      redeFiltro === TODOS || celula.rede === redeFiltro;

    return matchSearch && matchStatus && matchRede;
  });
}

export function CelulasScreen() {
  const router = useRouter();
  const { celulas, loading, erro } = useCelulas();
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>(TODOS);
  const [redeFiltro, setRedeFiltro] = useState<RedeFiltro>(TODOS);
  const [page, setPage] = useState(1);

  const filtradas = useMemo(
    () => filterCelulas(celulas, search, statusFiltro, redeFiltro),
    [celulas, search, statusFiltro, redeFiltro],
  );

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
  const paginaAtual = Math.min(page, totalPages);
  const inicio = (paginaAtual - 1) * PAGE_SIZE;
  const paginaItens = filtradas.slice(inicio, inicio + PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingBox />
      </Box>
    );
  }
  if (erro) {
    return (
      <Box sx={{ flex: 1 }}>
        <ErrorBox message={erro} />
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
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "1.25rem", md: "1.5rem" },
          fontWeight: 700,
          color: "#000",
          mb: 3,
          flexShrink: 0,
        }}
      >
        Listagem de Células
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 3, flexShrink: 0 }}
      >
        <TextField
          variant="outlined"
          placeholder="Pesquisar células"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
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

        <FormControl size="small" sx={FILTER_SELECT_SX}>
          <InputLabel id="filtro-status-label">Status</InputLabel>
          <Select
            labelId="filtro-status-label"
            label="Status"
            value={statusFiltro}
            onChange={(e) => {
              setStatusFiltro(e.target.value as StatusFiltro);
              setPage(1);
            }}
          >
            <MenuItem value={TODOS}>{TODOS}</MenuItem>
            <MenuItem value="Ativa">Ativa</MenuItem>
            <MenuItem value="Inativa">Inativa</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={FILTER_SELECT_SX}>
          <InputLabel id="filtro-rede-label">Rede</InputLabel>
          <Select
            labelId="filtro-rede-label"
            label="Rede"
            value={redeFiltro}
            onChange={(e) => {
              setRedeFiltro(e.target.value as RedeFiltro);
              setPage(1);
            }}
          >
            <MenuItem value={TODOS}>{TODOS}</MenuItem>
            {REDES_CELULA.map((rede) => (
              <MenuItem key={rede} value={rede}>
                {rede}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          Nova Célula
        </Button>
      </Stack>

      <TableContainer sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              {[
                "Nome da Célula",
                "Líder",
                "Rede",
                "Status",
                "Membros",
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
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    Nenhuma célula encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginaItens.map((celula) => (
                <TableRow
                  key={celula.id}
                  hover
                  sx={{
                    "& td": { borderBottom: "1px solid #ECECEC" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#000" }}>
                    {celula.nome}
                  </TableCell>
                  <TableCell sx={{ color: "#000" }}>
                    {celula.liderNome ?? "—"}
                  </TableCell>
                  <TableCell sx={{ color: "#000" }}>
                    {celula.rede ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge ativa={celula.ativa} />
                  </TableCell>
                  <TableCell sx={{ color: "#000" }}>
                    {celula.totalMembros}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/celulas/${celula.id}`)}
                        sx={{
                          borderRadius: 1.5,
                          color: "#5E79B3",
                          fontSize: "0.8rem",
                          gap: 0.5,
                          px: 1,
                        }}
                      >
                        <IconEye size={16} />
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.8rem",
                            display: { xs: "none", sm: "inline" },
                          }}
                        >
                          Ver detalhes
                        </Typography>
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={emBreve}
                        sx={{
                          borderRadius: 1.5,
                          color: "#5E79B3",
                          fontSize: "0.8rem",
                          gap: 0.5,
                          px: 1,
                        }}
                      >
                        <IconPencil size={16} />
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.8rem",
                            display: { xs: "none", sm: "inline" },
                          }}
                        >
                          Editar
                        </Typography>
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
