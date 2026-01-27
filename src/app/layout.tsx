"use client";

import ProviderStore from "../store/ProviderStore";
import ProviderTheme from "../utils/ProviderTheme";
import AuthProvider from "../components/auth/AuthProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt";
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from "notistack";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <HelmetProvider>
                        <ProviderStore>
                            <AuthProvider>
                                <ProviderTheme>{children}</ProviderTheme>
                            </AuthProvider>
                        </ProviderStore>
                    </HelmetProvider>
                </LocalizationProvider>
                <SnackbarProvider />
            </body>
        </html>
    );
}
