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
    const [formData, setFormData] = useState<Usuario>({
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
        setFormData({
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
        InputLabelProps: { sx: { color: "#666" } },
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
                        {user.nome}
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
                    <Grid item xs={12}>
                        <InputMask
                            mask="(99) 99999-9999"
                            value={formData.telefone}
                            onChange={(e) =>
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
                                    {...commonInputProps}
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
                                handleChange("endereco", e.target.value)
                            }
                            {...commonInputProps}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Data de Nascimento"
                            type="date"
                            variant="filled"
                            value={formData.nascimento}
                            onChange={(e) =>
                                handleChange("nascimento", e.target.value)
                            }
                            InputProps={{
                                ...commonInputProps.InputProps,
                                readOnly: !isEditing,
                            }}
                            InputLabelProps={{
                                shrink: true,
                                sx: { color: "#666" },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {isEditing ? (
                            <FormControl
                                fullWidth
                                variant="filled"
                                sx={{
                                    backgroundColor: "#eee",
                                    borderRadius: 2,
                                }}
                            >
                                <InputLabel sx={{ color: "#666" }}>
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
                                    <MenuItem value="Solteiro">
                                        Solteiro
                                    </MenuItem>
                                    <MenuItem value="Casado">Casado</MenuItem>
                                    <MenuItem value="Divorciado">
                                        Divorciado
                                    </MenuItem>
                                    <MenuItem value="Viúvo">Viúvo</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                fullWidth
                                label="Estado Civil"
                                variant="filled"
                                value={formData.estadoCivil}
                                {...commonInputProps}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        {isEditing ? (
                            <FormControl
                                fullWidth
                                variant="filled"
                                sx={{
                                    backgroundColor: "#eee",
                                    borderRadius: 2,
                                }}
                            >
                                <InputLabel sx={{ color: "#666" }}>
                                    Filhos
                                </InputLabel>
                                <Select
                                    value={formData.filhos}
                                    onChange={(e) =>
                                        handleChange("filhos", e.target.value)
                                    }
                                    disableUnderline
                                >
                                    <MenuItem value="Sim">Sim</MenuItem>
                                    <MenuItem value="Não">Não</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                fullWidth
                                label="Filhos"
                                variant="filled"
                                value={formData.filhos}
                                {...commonInputProps}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Ministério(s)"
                            variant="filled"
                            value={formData.ministerio}
                            InputProps={{
                                readOnly: true,
                                disableUnderline: true,
                                sx: {
                                    backgroundColor: "#eee",
                                    borderRadius: 2,
                                    color: "#000",
                                },
                            }}
                            InputLabelProps={{ sx: { color: "#666" } }}
                        />
                    </Grid>
                </Grid>
                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
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
