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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Usuario } from "@/features/usuarios/types";
import InputMask from "react-input-mask";
import { ChangeEvent, useRef } from "react";

interface UserProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: Usuario;
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
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        telefone: user.telefone || "",
        endereco: user.endereco || "",
        nascimento: user.nascimento || "",
        estadoCivil: user.estadoCivil || "",
        filhos: user.filhos || "",
        ministerio: user.ministerio || "",
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleEditToggle = () => {
        if (isEditing) {
            console.log("Salvar dados:", formData);
        }
        setIsEditing(!isEditing);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                onClick={onClose}
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
                            px: "8px",
                            py: "2px",
                            borderRadius: 1,
                            mt: "2px",
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
                                    InputProps={{
                                        readOnly: !isEditing,
                                        disableUnderline: true,
                                        sx: {
                                            backgroundColor: "#eee",
                                            borderRadius: 2,
                                            color: "#000",
                                        },
                                    }}
                                    InputLabelProps={{ sx: { color: "#666" } }}
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
                            InputProps={{
                                readOnly: !isEditing,
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
                                readOnly: !isEditing,
                                disableUnderline: true,
                                sx: {
                                    backgroundColor: "#eee",
                                    borderRadius: 2,
                                    color: "#000",
                                },
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
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 2,
                            px: 4,
                            mb: 1,
                            minWidth: 100,
                        }}
                    >
                        {isEditing ? "Salvar" : "Editar"}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
