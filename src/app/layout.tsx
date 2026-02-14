"use client";

import ProviderStore from "@/ui/stores/ProviderStore";
import ProviderTheme from "@/ui/utils/ProviderTheme";
import AuthProvider from "@/ui/components/auth/AuthProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt";
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from "notistack";
import { poppins } from "@/ui/utils/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className={poppins.className}>
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
