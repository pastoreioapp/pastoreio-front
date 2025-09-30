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
import { useState, ChangeEvent, useRef } from "react";
import { Usuario } from "@/features/usuarios/types";
import InputMask from "react-input-mask";
import { AlertColor } from "@mui/material/Alert";
import { Dispatch, SetStateAction } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface UserProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: Usuario;
    onAvatarChange?: Dispatch<SetStateAction<string | null>>;
}

export function getInitials(nome?: string): string {
    if (!nome || typeof nome !== "string") return "U";
    const partes = nome.trim().split(" ");
    return partes.length === 1
        ? partes[0][0].toUpperCase()
        : partes[0][0].toUpperCase() +
              partes[partes.length - 1][0].toUpperCase();
}

const getDefaultFormData = (user: Partial<Usuario> = {}) => ({
    nome: user.nome || "",
    funcao: user.funcao || "",
    telefone: user.telefone || "",
    email: user.email || "",
    nascimento: user.nascimento || "",
    endereco: user.endereco || "",
    estadoCivil: user.estadoCivil || "",
    conjuge: user.conjuge || "",
    filhos: user.filhos || "Não",
    ministerio: user.ministerio || "",
});

export default function UserProfileDialog({
    open,
    onClose,
    user,
}: UserProfileDialogProps) {
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState(() => getDefaultFormData(user));

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] =
        useState<AlertColor>("success");

    const showSnackbar = (
        message: string,
        severity: AlertColor = "success"
    ) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (field: keyof Usuario, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditToggle = async () => {
        if (isEditing) {
            setIsSaving(true);
            try {
                await new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Erro ao salvar")), 1500)
                );
            } catch {
                showSnackbar("Algo deu errado ao salvar os dados.", "error");
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
        setAvatarUrl(null);
        onClose();
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const commonInputProps = {
        InputProps: {
            readOnly: !isEditing,
            disableUnderline: true,
            sx: {
                backgroundColor: "#eee",
                borderRadius: 2,
                color: "#000",
            },
        },
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 4,
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
                    color: theme.palette.grey[700],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ pt: 5 }}>
                <Box
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={4}
                >
                    <Avatar
                        alt={user.nome}
                        src={avatarUrl || undefined}
                        sx={{
                            width: 96,
                            height: 96,
                            fontSize: 34,
                            fontWeight: 600,
                            bgcolor: theme.palette.primary.main,
                            color: "#fff",
                            mb: 1,
                        }}
                    >
                        {!avatarUrl && getInitials(user.nome)}
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
                                    border: "1px solid #ccc",
                                    "&:hover": { backgroundColor: "#f0f0f0" },
                                }}
                            >
                                <EditIcon fontSize="small" />
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
                    <Typography variant="h5" fontWeight={600}>
                        {formData.nome}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#fff",
                            backgroundColor: "#173D8A",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mt: 0.5,
                        }}
                    >
                        {user.funcao}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {isEditing ? (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nome"
                                variant="filled"
                                value={formData.nome}
                                onChange={(e) =>
                                    handleChange("nome", e.target.value)
                                }
                                {...commonInputProps}
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            />
                        </Grid>
                    ) : null}

                    <Grid item xs={12}>
                        <InputMask
                            mask="(99) 99999-9999"
                            value={formData.telefone}
                            onChange={(e) =>
                                isEditing &&
                                handleChange("telefone", e.target.value)
                            }
                            disabled={!isEditing}
                        >
                            {(inputProps: any) => (
                                <TextField
                                    {...inputProps}
                                    fullWidth
                                    label="Telefone"
                                    variant="filled"
                                    InputProps={{
                                        ...commonInputProps.InputProps,
                                        readOnly: !isEditing,
                                        disabled: !isEditing,
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                />
                            )}
                        </InputMask>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Endereço"
                            variant="filled"
                            value={formData.endereco}
                            onChange={(e) =>
                                isEditing &&
                                handleChange("endereco", e.target.value)
                            }
                            InputProps={{
                                ...commonInputProps.InputProps,
                                readOnly: !isEditing,
                                disabled: !isEditing,
                            }}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: theme.palette.primary.main,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
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
                                        : ""
                                )
                            }
                            readOnly={!isEditing}
                            slots={
                                !isEditing
                                    ? { openPickerIcon: () => null }
                                    : undefined
                            }
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "filled",
                                    disabled: !isEditing,
                                    InputProps: {
                                        readOnly: !isEditing,
                                        disableUnderline: true,
                                        sx: {
                                            backgroundColor: "#eee",
                                            borderRadius: 2,
                                            color: "#000",
                                        },
                                    },
                                    InputLabelProps: {
                                        shrink: true,
                                    },
                                    sx: {
                                        "& label": {
                                            color:
                                                theme.palette.primary.main +
                                                " !important",
                                        },
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor:
                                                theme.palette.text.disabled,
                                        },
                                        "& .Mui-disabled": {
                                            color: theme.palette.text.disabled,
                                        },
                                    },
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        {isEditing ? (
                            <FormControl
                                fullWidth
                                variant="filled"
                                sx={{ borderRadius: 2 }}
                            >
                                <InputLabel
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                    Estado Civil
                                </InputLabel>
                                <Select
                                    value={formData.estadoCivil}
                                    onChange={(e) =>
                                        handleChange(
                                            "estadoCivil",
                                            e.target.value
                                        )
                                    }
                                    disableUnderline
                                >
                                    {[
                                        {key: "Solteiro", name: "Solteiro(a)"},
                                        {key: "Casado", name: "Casado(a)"},
                                        {key: "Divorciado", name: "Divorciado(a)"},
                                        {key: "Viúvo", name: "Viúvo(a)"}
                                    ].map((item) => (
                                        <MenuItem key={item.key} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                fullWidth
                                label="Estado Civil"
                                variant="filled"
                                disabled
                                value={formData.estadoCivil}
                                {...commonInputProps}
                                sx={{
                                    "& label": {
                                        color:
                                            theme.palette.primary.main +
                                            " !important",
                                    },
                                    "& .MuiInputBase-input.Mui-disabled": {
                                        WebkitTextFillColor:
                                            theme.palette.text.disabled,
                                    },
                                    "& .Mui-disabled": {
                                        color: theme.palette.text.disabled,
                                    },
                                }}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        {isEditing ? (
                            <FormControl
                                fullWidth
                                variant="filled"
                                sx={{ borderRadius: 2 }}
                            >
                                <InputLabel
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                    Filhos
                                </InputLabel>
                                <Select
                                    value={formData.filhos}
                                    onChange={(e) =>
                                        handleChange("filhos", e.target.value)
                                    }
                                    disableUnderline
                                >
                                    {["Sim", "Não"].map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                fullWidth
                                label="Filhos"
                                variant="filled"
                                disabled
                                value={formData.filhos}
                                {...commonInputProps}
                                sx={{
                                    "& label": {
                                        color:
                                            theme.palette.primary.main +
                                            " !important",
                                    },
                                    "& .MuiInputBase-input.Mui-disabled": {
                                        WebkitTextFillColor:
                                            theme.palette.text.disabled,
                                    },
                                    "& .Mui-disabled": {
                                        color: theme.palette.text.disabled,
                                    },
                                }}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Ministério(s)"
                            variant="filled"
                            disabled={true}
                            value={formData.ministerio}
                            InputProps={{
                                readOnly: !isEditing,
                                disableUnderline: true,
                                sx: {
                                    borderRadius: 2,
                                },
                            }}
                            sx={{
                                "& label": {
                                    color:
                                        theme.palette.primary.main +
                                        " !important",
                                },
                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor:
                                        theme.palette.text.disabled,
                                },
                                "& .Mui-disabled": {
                                    color: theme.palette.text.disabled,
                                },
                            }}
                        />
                    </Grid>
                </Grid>
                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    {isEditing ? (
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(getDefaultFormData(user));
                                setAvatarUrl(null);
                            }}
                            variant={"outlined"}
                            sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                borderRadius: 2,
                                px: 4,
                                mb: 1,
                                minWidth: 100,
                            }}
                        >
                            Cancelar
                        </Button>
                    ) : null}
                    <Button
                        variant={isEditing ? "contained" : "outlined"}
                        color="primary"
                        onClick={handleEditToggle}
                        disabled={isSaving}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 2,
                            px: 4,
                            mb: 1,
                            minWidth: 100,
                        }}
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
