"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Avatar,
    Typography,
    Box,
    Divider,
    Button,
    Grid,
    Paper,
} from "@mui/material";

interface UserProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: {
        name: string;
        email: string;
        initials?: string;
    };
}

export default function UserProfileDialog({
    open,
    onClose,
    user,
}: UserProfileDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "16px",
                    padding: "24px",
                },
            }}
        >
            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={4}
                >
                    <Avatar
                        src=""
                        alt={user.name}
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: "#0d3b8a",
                            fontSize: 36,
                            mb: 1,
                        }}
                    >
                        {user.initials || user.name[0]}
                    </Avatar>
                    <Typography variant="h4">{user.name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                        {user.email}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                    {[
                        { label: "Telefone", value: "+55 91 91234-5678" },
                        {
                            label: "Endereço",
                            value: "Rua Exemplo, 123 - Centro",
                        },
                        { label: "Data de Nascimento", value: "01/01/1990" },
                        { label: "Estado Civil", value: "Casado" },
                        { label: "Ministério", value: "Louvor" },
                        { label: "Filhos", value: "Não" },
                    ].map((field, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    py: 1,
                                    px: 2,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "10px",
                                    height: "100%",
                                    backgroundColor: "#fafafa",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontWeight={500}
                                >
                                    {field.label}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {field.value}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" color="primary">
                        Editar
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="primary"
                    >
                        Fechar
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
