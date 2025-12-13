"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import ProviderStore from "../store/ProviderStore";
import ProviderTheme from "../utils/ProviderTheme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt";
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from "notistack";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                <GoogleOAuthProvider clientId="">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <HelmetProvider>
                            <ProviderStore>
                                <ProviderTheme>{children}</ProviderTheme>
                            </ProviderStore>
                        </HelmetProvider>
                    </LocalizationProvider>
                </GoogleOAuthProvider>
                <SnackbarProvider />
            </body>
        </html>
    );
}
