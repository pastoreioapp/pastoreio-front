"use client";

import {
    Box,
    FormControl,
    Grid,
    Select,
    TextField,
    Typography,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { PapelCelula } from "@/modules/celulas/domain/papel-celula";
import { getFuncaoLabel } from "../../../lib/getFuncaoLabel";

export const applyPhoneMask = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7)
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

const SectionTitle = ({ title }: { title: string }) => (
    <Box display="flex" alignItems="center" mb={2} mt={4}>
        <Box
            sx={{
                width: 4,
                height: 20,
                bgcolor: "#3b5998",
                mr: 1.5,
                borderRadius: 1,
            }}
        />
        <Typography
            variant="subtitle1"
            sx={{ color: "#3b5998", fontWeight: 700 }}
        >
            {title}
        </Typography>
    </Box>
);

const CustomInput = ({
    label,
    placeholder,
    children,
    error,
    helperText,
    ...props
}: {
    label: string;
    placeholder?: string;
    children?: ReactNode;
    error?: boolean;
    helperText?: string;
    [x: string]: any;
}) => (
    <Box>
        <Typography
            sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: error ? "#d32f2f" : "#4B5563",
                mb: 1,
                textTransform: "uppercase",
            }}
        >
            {label}
        </Typography>

        {children ? (
            <>
                {children}
                {helperText && (
                    <FormHelperText error={error}>{helperText}</FormHelperText>
                )}
            </>
        ) : (
            <TextField
                fullWidth
                placeholder={placeholder}
                variant="outlined"
                size="small"
                error={error}
                helperText={helperText}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F4F6F8",
                        padding: "5px",
                        borderRadius: "8px",
                        "& fieldset": {
                            border: error ? "1px solid #d32f2f" : "none",
                        },
                        "&:hover fieldset": {
                            border: error ? "1px solid #d32f2f" : "none",
                        },
                        "&.Mui-focused fieldset": {
                            border: error ? "1px solid #d32f2f" : "none",
                        },
                        "&.Mui-disabled": {
                            backgroundColor: "#EEF1F5",
                            opacity: 0.75,
                            cursor: "not-allowed",
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: "#1F2937",
                        "&::placeholder": { color: "#9CA3AF", opacity: 1 },
                        "&.Mui-disabled": {
                            WebkitTextFillColor: "#9CA3AF",
                            cursor: "not-allowed",
                        },
                    },
                }}
                {...props}
            />
        )}
    </Box>
);

const CARGO_OPTIONS = [
    PapelCelula.AUXILIAR_CELULA,
    PapelCelula.MEMBRO,
    PapelCelula.VISITANTE,
] as const;

const MINISTERIOS_OPTIONS = [
    "Nenhum",
    "Louvor",
    "Paz Kids",
    "Mídia",
    "Atmosfera",
    "Intercessão",
] as const;

interface DadosProps {
    data: {
        nome: string;
        nascimento: string | null;
        email: string;
        telefone: string;
        endereco: string;
        cargo: PapelCelula;
        ministerio: string;
        discipulador: string;
        discipulo: string;
        estadoCivil: string;
        conjuge: string;
        filhos: string;
    };
    onChange: (field: string, value: any) => void;
}

export function Dados({ data, onChange }: DadosProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: any) => {
        if (field === "telefone") {
            value = applyPhoneMask(value);
        }

        onChange(field, value);

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleBlur = (field: keyof typeof data) => {
        if (!data[field] || String(data[field]).trim() === "") {
            setErrors((prev) => ({ ...prev, [field]: "Campo obrigatório" }));
        }

        if (
            field === "email" &&
            data.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
        ) {
            setErrors((prev) => ({ ...prev, email: "E-mail inválido" }));
        }
    };

    const selectStyles = {
        backgroundColor: "#F4F6F8",
        padding: "5px",
        borderRadius: "8px",
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        color: "#4B5563",
    };

    return (
        <Box sx={{ px: 6.5, pb: 4, pt: 0 }}>
            <SectionTitle title="Informações Pessoais" />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <CustomInput
                        label="Nome"
                        placeholder="Nome Completo do Membro"
                        value={data.nome}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("nome", e.target.value)
                        }
                        onBlur={() => handleBlur("nome")}
                        error={!!errors.nome}
                        helperText={errors.nome}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <CustomInput
                        label="Data de Nascimento"
                        error={!!errors.nascimento}
                        helperText={errors.nascimento}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={
                                data.nascimento ? dayjs(data.nascimento) : null
                            }
                            onChange={(date: Dayjs | null) => {
                                handleChange(
                                    "nascimento",
                                    date && date.isValid()
                                        ? date.toISOString()
                                        : null,
                                );
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                    placeholder: "DD/MM/AAAA",
                                    error: !!errors.nascimento,
                                    sx: {
                                        "& .MuiInputBase-root, & .MuiOutlinedInput-root, & .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root":
                                        {
                                            backgroundColor: "#F4F6F8",
                                            borderRadius: "8px",
                                            minHeight: "48px",
                                            height: "48px",
                                            padding: "5px",
                                            alignItems: "center",

                                            "& fieldset": {
                                                border: errors.nascimento
                                                    ? "1px solid #d32f2f"
                                                    : "none",
                                            },

                                            "&:hover fieldset": {
                                                border: errors.nascimento
                                                    ? "1px solid #d32f2f"
                                                    : "none",
                                            },

                                            "&.Mui-focused fieldset": {
                                                border: errors.nascimento
                                                    ? "1px solid #d32f2f"
                                                    : "none",
                                            },
                                        },

                                        "& .MuiInputBase-input": {
                                            color: "#1F2937",
                                            padding: "0 14px 0 16px",
                                            height: "100%",
                                            boxSizing: "border-box",

                                            "&::placeholder": {
                                                color: "#9CA3AF",
                                                opacity: 1,
                                            },
                                        },

                                        "& .MuiPickersInputBase-sectionsContainer":
                                        {
                                            color: "#1F2937",
                                            padding: "0 14px 0 16px",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            ml: 1.5,
                                        },

                                        "& .MuiPickersSectionList-root": {
                                            padding: 0,
                                        },

                                        "& .MuiIconButton-root": {
                                            color: "#6B7280",
                                            padding: "6px",
                                            mr: 0.5,
                                        },
                                    },
                                },
                            }}
                        />
                    </CustomInput>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <CustomInput
                        label="Email"
                        placeholder="exemplo@email.com"
                        value={data.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("email", e.target.value)
                        }
                        onBlur={() => handleBlur("email")}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <CustomInput
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        value={data.telefone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("telefone", e.target.value)
                        }
                        onBlur={() => handleBlur("telefone")}
                        error={!!errors.telefone}
                        helperText={errors.telefone}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CustomInput
                        label="Endereço"
                        placeholder="Rua, número, bairro e cidade"
                        value={data.endereco}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("endereco", e.target.value)
                        }
                        onBlur={() => handleBlur("endereco")}
                        error={!!errors.endereco}
                        helperText={errors.endereco}
                    />
                </Grid>
            </Grid>

            <SectionTitle title="Vida Ministerial" />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <CustomInput
                        label="Cargo"
                        error={!!errors.cargo}
                        helperText={errors.cargo}
                    >
                        <FormControl
                            fullWidth
                            size="small"
                            error={!!errors.cargo}
                        >
                            <Select
                                value={data.cargo || PapelCelula.MEMBRO}
                                onChange={(e) =>
                                    handleChange("cargo", e.target.value)
                                }
                                onBlur={() => handleBlur("cargo")}
                                displayEmpty
                                sx={selectStyles}
                            >
                                {CARGO_OPTIONS.map((papel) => (
                                    <MenuItem key={papel} value={papel}>
                                        {getFuncaoLabel(papel)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CustomInput>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomInput
                        label="Ministério"
                        error={!!errors.ministerio}
                        helperText={errors.ministerio}
                    >
                        <FormControl
                            fullWidth
                            size="small"
                            error={!!errors.ministerio}
                        >
                            <Select
                                value={data.ministerio || "Nenhum"}
                                onChange={(e) =>
                                    handleChange("ministerio", e.target.value)
                                }
                                onBlur={() => handleBlur("ministerio")}
                                displayEmpty
                                sx={selectStyles}
                            >
                                {MINISTERIOS_OPTIONS.map((ministerio) => (
                                    <MenuItem
                                        key={ministerio}
                                        value={ministerio}
                                    >
                                        {ministerio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CustomInput>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomInput
                        label="Discipulador"
                        placeholder="Nome do discipulador"
                        value={data.discipulador}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("discipulador", e.target.value)
                        }
                        onBlur={() => handleBlur("discipulador")}
                        error={!!errors.discipulador}
                        helperText={errors.discipulador}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomInput
                        label="Discípulo"
                        placeholder="Nome do discípulo"
                        value={data.discipulo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("discipulo", e.target.value)
                        }
                        onBlur={() => handleBlur("discipulo")}
                        error={!!errors.discipulo}
                        helperText={errors.discipulo}
                    />
                </Grid>
            </Grid>

            <SectionTitle title="Família" />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <CustomInput label="Estado Civil">
                        <FormControl fullWidth size="small">
                            <Select
                                value={data.estadoCivil}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    handleChange("estadoCivil", value);

                                    if (value !== "Casado") {
                                        handleChange("conjuge", "");
                                    }
                                }}
                                displayEmpty
                                sx={selectStyles}
                            >
                                <MenuItem value="Solteiro">
                                    Solteiro(a)
                                </MenuItem>
                                <MenuItem value="Casado">Casado(a)</MenuItem>
                                <MenuItem value="Divorciado">
                                    Divorciado(a)
                                </MenuItem>
                                <MenuItem value="Viúvo">Viúvo(a)</MenuItem>
                            </Select>
                        </FormControl>
                    </CustomInput>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomInput
                        label="Cônjuge"
                        placeholder={
                            data.estadoCivil === "Casado"
                                ? "Nome do cônjuge"
                                : "Disponível apenas para casado(a)"
                        }
                        value={data.conjuge}
                        disabled={data.estadoCivil !== "Casado"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("conjuge", e.target.value)
                        }
                        error={
                            data.estadoCivil === "Casado" && !!errors.conjuge
                        }
                        helperText={
                            data.estadoCivil !== "Casado"
                                ? "Este campo é habilitado somente quando o estado civil for Casado(a)."
                                : errors.conjuge
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomInput label="Filhos">
                        <FormControl fullWidth size="small">
                            <Select
                                value={data.filhos}
                                onChange={(e) =>
                                    handleChange("filhos", e.target.value)
                                }
                                displayEmpty
                                sx={selectStyles}
                            >
                                <MenuItem value="Sim">Sim</MenuItem>
                                <MenuItem value="Nao">Não</MenuItem>
                            </Select>
                        </FormControl>
                    </CustomInput>
                </Grid>
            </Grid>
        </Box>
    );
}
