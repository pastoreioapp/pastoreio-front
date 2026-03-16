"use client";

import {
    Dialog,
    DialogContent,
    Avatar,
    Typography,
    Box,
    Button,
    Grid,
    TextField,
    useTheme,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Alert as MuiAlert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState, ChangeEvent, useRef, useEffect, ReactNode } from "react";
import { Usuario } from "@/modules/controleacesso/domain/usuario";
import { LoggedUserResponse } from "@/modules/controleacesso/domain/types";
import { AlertColor } from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { patchUsuario } from "@/modules/controleacesso/application/usuario.service";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "@/ui/stores/features/loggedUserSlice";
import { getInitials } from "@/ui/utils/getInitials";
import { resizeImage } from "@/ui/utils/imageUtils";

interface UserProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: LoggedUserResponse;
}

export const applyPhoneMask = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7)
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

const getDefaultFormData = (
    user: Partial<Usuario> & { sobrenome?: string } = {},
) => ({
    nome: user.nome || "",
    sobrenome: user.sobrenome || "",
    funcao: user.funcao || "",
    telefone: applyPhoneMask(user.telefone || ""),
    email: user.email || "",
    nascimento: user.nascimento || "",
    endereco: user.endereco || "",
    estadoCivil: user.estadoCivil || "",
    filhos: user.filhos || "",
    ministerio: user.ministerio || "",
});

const FieldWrapper = ({
    label,
    value,
    isEditing,
    children,
}: {
    label: string;
    value: string | ReactNode;
    isEditing: boolean;
    children: ReactNode;
}) => {
    const theme = useTheme();

    if (isEditing) {
        return <>{children}</>;
    }

    return (
        <Box
            sx={{
                mb: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 0.5,
                height: "100%",
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    display: "block",
                    mb: 0.5,
                    fontSize: "0.7rem",
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                }}
            >
                {value || "-"}
            </Typography>
        </Box>
    );
};

export default function UserProfileDialog({
    open,
    onClose,
    user,
}: UserProfileDialogProps) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl || null);
    const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
    const [formData, setFormData] = useState(() => getDefaultFormData(user));

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] =
        useState<AlertColor>("success");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData(getDefaultFormData(user));
            setAvatarUrl(user.avatarUrl || null);
        }
    }, [user]);

    const showSnackbar = (
        message: string,
        severity: AlertColor = "success",
    ) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPendingAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (field: string, value: string) => {
        if (field === "telefone") {
            setFormData((prev) => ({
                ...prev,
                [field]: applyPhoneMask(value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleEditToggle = async () => {
        if (isEditing) {
            setIsSaving(true);
            try {
                const payload: Partial<Usuario> = {
                    ...formData,
                    filhos:
                        formData.filhos === "Sim" || formData.filhos === "Não"
                            ? formData.filhos
                            : undefined,
                };

                let resizedFile: File | undefined;
                if (pendingAvatarFile) {
                    resizedFile = await resizeImage(pendingAvatarFile);
                }

                const result = await patchUsuario(payload, resizedFile);

                showSnackbar("Dados salvos com sucesso!", "success");
                setIsEditing(false);
                setPendingAvatarFile(null);

                if (user) {
                    const newAvatarUrl = result.avatarUrl || avatarUrl;
                    dispatch(
                        setLoggedUser({
                            ...user,
                            ...formData,
                            nome: formData.nome,
                            sobrenome: formData.sobrenome,
                            avatarUrl: newAvatarUrl,
                        }),
                    );
                    if (newAvatarUrl) {
                        setAvatarUrl(newAvatarUrl);
                    }
                }
            } catch (error: unknown) {
                const message =
                    error instanceof Error ? error.message : "Erro ao salvar os dados. Tente novamente.";
                showSnackbar("Erro ao salvar os dados. Tente novamente.", "error");
            } finally {
                setIsSaving(false);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setFormData(getDefaultFormData(user));
        setAvatarUrl(user.avatarUrl || null);
        setPendingAvatarFile(null);
        onClose();
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const nomeCompleto = `${formData.nome} ${formData.sobrenome}`.trim();

    function getMainUserRole(perfis: string[]): string {
        if (!perfis || perfis.length === 0) return "Perfil desconhecido";
        const role = perfis[0];
        switch (role) {
            case "ADMINISTRADOR_SISTEMA":
                return "Administrador do Sistema";
            case "ADMINISTRADOR_IGREJA":
                return "Administrador da Igreja";
            case "LIDER_CELULA":
                return "Líder de Célula";
            case "AUXILIAR_CELULA":
                return "Auxiliar de Célula";
            case "MEMBRO":
                return "Membro";
            default:
                return "";
        }
    }

    const baseFieldProps = {
        size: "small" as const,
        fullWidth: true,
        variant: "outlined" as const,
        sx: {
            "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.12)",
                },
                "&:hover fieldset": {
                    borderColor: `${theme.palette.primary.dark} !important`,
                },
                "&.Mui-focused fieldset": {
                    borderColor: `${theme.palette.primary.main} !important`,
                },
                "&.Mui-disabled": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.12) !important",
                    },
                },
            },
            "& .MuiInputBase-input": {
                color: "rgba(0, 0, 0, 0.87)",
                "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.38)",
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.38)",
                },
                "&::placeholder": {
                    opacity: "1 !important",
                    color: "rgba(0, 0, 0, 0.4) !important",
                },
            },
        },
    };

    const editInputProps = {
        ...baseFieldProps,
        InputLabelProps: { shrink: true },
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    color: "#000",
                },
            }}
        >
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    color: theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent sx={{ pt: 5, pb: 4, px: 4 }}>
                <Box
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={4}
                >
                    <Avatar
                        alt={nomeCompleto}
                        src={avatarUrl || undefined}
                        sx={{
                            width: 96,
                            height: 96,
                            fontSize: 34,
                            fontWeight: 600,
                            bgcolor: theme.palette.primary.main,
                            color: "#fff",
                            mb: 1,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    >
                        {!avatarUrl &&
                            getInitials(formData.nome, formData.sobrenome)}
                    </Avatar>

                    {isEditing && (
                        <>
                            <IconButton
                                size="small"
                                onClick={triggerFileInput}
                                sx={{
                                    position: "absolute",
                                    top: 70,
                                    right: "calc(50% - 48px)",
                                    backgroundColor: "#fff",
                                    border: `1px solid ${theme.palette.divider}`,
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                    boxShadow: 1,
                                }}
                            >
                                <EditIcon fontSize="small" color="primary" />
                            </IconButton>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </>
                    )}

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        textAlign="center"
                        mt={1}
                    >
                        {nomeCompleto || "Usuário"}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#fff",
                            backgroundColor: "#5E79B3",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            mt: 1,
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            letterSpacing: 0.5,
                            textTransform: "uppercase",
                        }}
                    >
                        {getMainUserRole(user.perfis)}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {isEditing && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nome"
                                    value={formData.nome}
                                    placeholder="Digite seu nome"
                                    onChange={(e) =>
                                        handleChange("nome", e.target.value)
                                    }
                                    {...editInputProps}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Sobrenome"
                                    value={formData.sobrenome}
                                    placeholder="Digite seu sobrenome"
                                    onChange={(e) =>
                                        handleChange(
                                            "sobrenome",
                                            e.target.value,
                                        )
                                    }
                                    {...editInputProps}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} sm={6}>
                        <FieldWrapper
                            label="E-mail"
                            value={formData.email}
                            isEditing={isEditing}
                        >
                            <TextField
                                label="E-mail"
                                value={formData.email}
                                placeholder="exemplo@gmail.com"
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                disabled={user?.provider !== "phone"}
                                helperText={
                                    user?.provider !== "phone"
                                        ? "Gerenciado pela credencial de login"
                                        : ""
                                }
                                FormHelperTextProps={{
                                    sx: {
                                        color: theme.palette.text.secondary,
                                        marginX: 0,
                                    },
                                }}
                                {...editInputProps}
                            />
                        </FieldWrapper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FieldWrapper
                            label="Telefone"
                            value={formData.telefone || "-"}
                            isEditing={isEditing}
                        >
                            <TextField
                                label="Telefone"
                                value={formData.telefone}
                                placeholder="(00) 00000-0000"
                                onChange={(e) =>
                                    handleChange("telefone", e.target.value)
                                }
                                disabled={user?.provider === "phone"}
                                helperText={
                                    user?.provider === "phone"
                                        ? "Gerenciado pela credencial de login"
                                        : ""
                                }
                                FormHelperTextProps={{
                                    sx: {
                                        color: theme.palette.text.secondary,
                                        marginX: 0,
                                    },
                                }}
                                {...editInputProps}
                            />
                        </FieldWrapper>
                    </Grid>

                    <Grid item xs={12}>
                        <FieldWrapper
                            label="Endereço"
                            value={formData.endereco}
                            isEditing={isEditing}
                        >
                            <TextField
                                label="Endereço"
                                value={formData.endereco}
                                placeholder="Rua, Número, Bairro"
                                onChange={(e) =>
                                    handleChange("endereco", e.target.value)
                                }
                                {...editInputProps}
                            />
                        </FieldWrapper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FieldWrapper
                            label="Data de Nascimento"
                            value={
                                formData.nascimento
                                    ? dayjs(formData.nascimento).format(
                                          "DD/MM/YYYY",
                                      )
                                    : ""
                            }
                            isEditing={isEditing}
                        >
                            <DatePicker
                                label="Data de Nascimento"
                                format="DD/MM/YYYY"
                                value={
                                    formData.nascimento
                                        ? dayjs(formData.nascimento)
                                        : null
                                }
                                onChange={(date: Dayjs | null) =>
                                    handleChange(
                                        "nascimento",
                                        date && date.isValid()
                                            ? date.toDate().toISOString()
                                            : "",
                                    )
                                }
                                sx={baseFieldProps.sx}
                                slotProps={{
                                    textField: {
                                        ...editInputProps,
                                        placeholder: "DD/MM/AAAA",
                                    },
                                }}
                            />
                        </FieldWrapper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FieldWrapper
                            label="Estado Civil"
                            value={formData.estadoCivil}
                            isEditing={isEditing}
                        >
                            <FormControl {...baseFieldProps}>
                                <InputLabel shrink>Estado Civil</InputLabel>
                                <Select
                                    value={formData.estadoCivil}
                                    onChange={(e) =>
                                        handleChange(
                                            "estadoCivil",
                                            e.target.value,
                                        )
                                    }
                                    label="Estado Civil"
                                    notched
                                    displayEmpty
                                >
                                    <MenuItem
                                        value=""
                                        disabled
                                        sx={{ display: "none" }}
                                    >
                                        Selecione
                                    </MenuItem>
                                    {[
                                        {
                                            key: "Solteiro",
                                            name: "Solteiro(a)",
                                        },
                                        { key: "Casado", name: "Casado(a)" },
                                        {
                                            key: "Divorciado",
                                            name: "Divorciado(a)",
                                        },
                                        { key: "Viúvo", name: "Viúvo(a)" },
                                    ].map((item) => (
                                        <MenuItem
                                            key={item.key}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FieldWrapper>
                    </Grid>

                    <Grid item xs={12}>
                        <FieldWrapper
                            label="Filhos"
                            value={formData.filhos}
                            isEditing={isEditing}
                        >
                            <FormControl {...baseFieldProps}>
                                <InputLabel shrink>Filhos</InputLabel>
                                <Select
                                    value={formData.filhos}
                                    onChange={(e) =>
                                        handleChange("filhos", e.target.value)
                                    }
                                    label="Filhos"
                                    notched
                                    displayEmpty
                                >
                                    <MenuItem
                                        value=""
                                        disabled
                                        sx={{ display: "none" }}
                                    >
                                        Selecione
                                    </MenuItem>
                                    {["Sim", "Não"].map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FieldWrapper>
                    </Grid>

                    <Grid item xs={12}>
                        <FieldWrapper
                            label="Ministério(s)"
                            value={formData.ministerio}
                            isEditing={isEditing}
                        >
                            <TextField
                                label="Ministério(s)"
                                value={formData.ministerio}
                                placeholder="Nenhum"
                                disabled={true}
                                helperText="Gerenciado pela secretaria da igreja"
                                FormHelperTextProps={{
                                    sx: {
                                        color: theme.palette.text.secondary,
                                        marginX: 0,
                                    },
                                }}
                                {...editInputProps}
                            />
                        </FieldWrapper>
                    </Grid>
                </Grid>

                <Box mt={5} display="flex" justifyContent="flex-end" gap={2}>
                    {isEditing && (
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(getDefaultFormData(user));
                                setAvatarUrl(user.avatarUrl || null);
                                setPendingAvatarFile(null);
                            }}
                            variant="outlined"
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                px: 3,
                                color: theme.palette.text.primary,
                                borderColor: theme.palette.divider,
                                "&:hover": {
                                    borderColor: theme.palette.text.secondary,
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        variant={isEditing ? "contained" : "outlined"}
                        color="primary"
                        onClick={handleEditToggle}
                        disabled={isSaving}
                        startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                        sx={{ textTransform: "none", borderRadius: 2, px: 4 }}
                    >
                        {isSaving
                            ? "Salvando..."
                            : isEditing
                              ? "Salvar"
                              : "Editar"}
                    </Button>
                </Box>
            </DialogContent>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <MuiAlert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Dialog>
    );
}
