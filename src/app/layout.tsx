"use client";

import ProviderStore from "../store/ProviderStore";
import ProviderTheme from "../utils/ProviderTheme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt";
import { HelmetProvider } from "react-helmet-async";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>
                <HelmetProvider>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="pt-br"
                    >
                        <ProviderStore>
                            <ProviderTheme>{children}</ProviderTheme>
                        </ProviderStore>
                    </LocalizationProvider>
                </HelmetProvider>
            </body>
        </html>
    );
}
