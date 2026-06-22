"use client";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { enqueueSnackbar } from "notistack";
import type { MembroDaCelulaListItemDto } from "@/modules/celulas/application/dtos";
import type { UpdateMembroPorLiderDto } from "@/modules/secretaria/application/dtos";
import { updateMembroPorLider } from "@/app/actions/membros";

const applyPhoneMask = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

type FormState = {
    telefone: string;
    email: string;
    dataNascimento: Dayjs | null;
    endereco: string;
    estadoCivil: string;
    conjuge: string;
    filhos: string;
    discipulador: string;
    discipulando: string;
    ministerio: string;
};

function toFormState(data: MembroDaCelulaListItemDto): FormState {
    return {
        telefone: applyPhoneMask(data.telefone ?? ""),
        email: data.email ?? "",
        dataNascimento: data.dataNascimento ? dayjs(data.dataNascimento) : null,
        endereco: data.endereco ?? "",
        estadoCivil: data.estadoCivil ?? "",
        conjuge: data.conjuge ?? "",
        filhos: data.filhos ?? "",
        discipulador: data.discipulador ?? "",
        discipulando: data.discipulando ?? "",
        ministerio: data.ministerio ?? "",
    };
}

type Props = {
    open: boolean;
    membro: MembroDaCelulaListItemDto;
    onClose: () => void;
    onSaved: () => void;
};

export function ModalEditarMembro({ open, membro, onClose, onSaved }: Props) {
    const [form, setForm] = useState<FormState>(() => toFormState(membro));
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(toFormState(membro));
        }
    }, [open, membro]);

    const handleChange = (field: keyof FormState, value: string | Dayjs | null) => {
        if (field === "telefone" && typeof value === "string") {
            setForm((prev) => ({ ...prev, telefone: applyPhoneMask(value) }));
            return;
        }
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            enqueueSnackbar("E-mail inválido.", { variant: "warning", autoHideDuration: 3000 });
            return;
        }

        const dto: UpdateMembroPorLiderDto = {
            telefone: form.telefone || null,
            email: form.email || null,
            dataNascimento: form.dataNascimento?.format("YYYY-MM-DD") ?? null,
            endereco: form.endereco || null,
            estadoCivil: form.estadoCivil || null,
            conjuge: form.conjuge || null,
            filhos: form.filhos || null,
            discipulador: form.discipulador || null,
            discipulando: form.discipulando || null,
            ministerio: form.ministerio || null,
        };

        try {
            setSalvando(true);
            await updateMembroPorLider(membro.id, dto);
            enqueueSnackbar("Dados atualizados com sucesso!", {
                variant: "success",
                autoHideDuration: 2000,
            });
            onSaved();
            onClose();
        } catch (error: unknown) {
            enqueueSnackbar(
                error instanceof Error ? error.message : "Erro ao salvar dados do membro",
                { variant: "error", autoHideDuration: 3000 },
            );
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
                    background: "linear-gradient(135deg, #4A6499 0%, #5E79B3 40%, #7B95CC 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: { xs: 2, md: 3 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>
                        Editar membro
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.8rem", mt: 0.25 }}>
                        {membro.nome ?? "Membro"}
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    aria-label="Fechar"
                    sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}
                >
                    <IconX size={20} />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Telefone"
                        value={form.telefone}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label="E-mail"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <DatePicker
                        label="Nascimento"
                        value={form.dataNascimento}
                        onChange={(value) => handleChange("dataNascimento", value)}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                    <TextField
                        label="Endereço"
                        value={form.endereco}
                        onChange={(e) => handleChange("endereco", e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <FormControl size="small" fullWidth>
                        <InputLabel>Estado civil</InputLabel>
                        <Select
                            label="Estado civil"
                            value={form.estadoCivil}
                            onChange={(e) => handleChange("estadoCivil", e.target.value)}
                        >
                            <MenuItem value="">—</MenuItem>
                            <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                            <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                            <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
                            <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Cônjuge"
                        value={form.conjuge}
                        onChange={(e) => handleChange("conjuge", e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <FormControl size="small" fullWidth>
                        <InputLabel>Filhos</InputLabel>
                        <Select
                            label="Filhos"
                            value={form.filhos}
                            onChange={(e) => handleChange("filhos", e.target.value)}
                        >
                            <MenuItem value="">—</MenuItem>
                            <MenuItem value="Sim">Sim</MenuItem>
                            <MenuItem value="Não">Não</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Discípulo de"
                        value={form.discipulador}
                        onChange={(e) => handleChange("discipulador", e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label="Discipulando"
                        value={form.discipulando}
                        onChange={(e) => handleChange("discipulando", e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label="Ministério"
                        value={form.ministerio}
                        onChange={(e) => handleChange("ministerio", e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button color="inherit" onClick={onClose} disabled={salvando}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={() => void handleSubmit()}
                    disabled={salvando}
                    sx={{ bgcolor: "#5E79B3", "&:hover": { bgcolor: "#4A6499" } }}
                >
                    {salvando ? "Salvando..." : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
