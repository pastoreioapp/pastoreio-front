import { TextField, TextFieldProps } from "@mui/material";

export default function CustomTextField(props: TextFieldProps) {
    return (
        <TextField
            {...props}
            sx={{
                "& .MuiOutlinedInput-input::placeholder": {
                    color: (theme) => theme.palette.text.secondary,
                    opacity: 0.8,
                },
                "& .MuiOutlinedInput-input.Mui-disabled::placeholder": {
                    color: (theme) => theme.palette.text.secondary,
                    opacity: 1,
                },
                "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) => theme.palette.grey[200],
                },
            }}
        />
    );
}
