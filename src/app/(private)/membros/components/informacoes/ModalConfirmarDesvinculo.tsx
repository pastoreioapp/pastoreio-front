"use client";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

type Props = {
    open: boolean;
    nomeDoMembro: string;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function ModalConfirmarDesvinculo({
    open,
    nomeDoMembro,
    loading,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Desvincular membro</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Tem certeza que deseja desvincular{" "}
                    <strong>{nomeDoMembro}</strong> da célula? O membro será
                    removido da lista atual, mas o histórico do vínculo será
                    mantido.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                >
                    {loading ? "Desvinculando..." : "Desvincular"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
