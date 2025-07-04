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
    Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Membro } from "@/types/types";

interface UserProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: Membro;
}

export function getInitials(nome: string): string {
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

    const [formData, setFormData] = useState({
        telefone: user.telefone || "",
        endereco: user.endereco || "",
        nascimento: user.nascimento || "",
        estado_civil: user.estado_civil || "",
        filhos: user.filhos || "",
        ministerio: user.ministerio || "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleEditToggle = () => {
        if (isEditing) {
            console.log("Salvar dados:", formData);
        }
        setIsEditing(!isEditing);
    };

    const fields = [
        { label: "Telefone", field: "telefone" },
        { label: "Endereço", field: "endereco" },
        { label: "Data de Nascimento", field: "nascimento" },
        { label: "Estado Civil", field: "estado_civil" },
        { label: "Filhos", field: "filhos" },
        { label: "Ministério", field: "ministerio" },
    ];

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
                        {getInitials(user.nome)}
                    </Avatar>

                    {isEditing && (
                        <Tooltip title="Alterar imagem">
                            <IconButton
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: 80,
                                    right: "calc(50% - 48px)",
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    "&:hover": { backgroundColor: "#f0f0f0" },
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Typography variant="h5" fontWeight={600}>
                        {user.nome}
                    </Typography>
                    <Typography variant="body2" sx={{color: "#fff", backgroundColor: "#173D8A", px: "8px", py: "2px", borderRadius: 1, mt: "2px"}} >
                        {user.funcao}
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {fields.map((item, index) => (
                        <Grid item xs={12} key={index}>
                            <TextField
                                fullWidth
                                label={item.label}
                                variant="filled"
                                value={
                                    formData[
                                        item.field as keyof typeof formData
                                    ]
                                }
                                onChange={(e) =>
                                    handleChange(item.field, e.target.value)
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
                                    sx: {
                                        color: "#666",
                                    },
                                }}
                            />
                        </Grid>
                    ))}
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
