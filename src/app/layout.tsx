"use client";

import ProviderStore from "../store/ProviderStore";
import ProviderTheme from "../utils/ProviderTheme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/pt';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <ProviderStore>
                        <ProviderTheme>{children}</ProviderTheme>
                    </ProviderStore>
                </LocalizationProvider>
            </body>
        </html>
    );
}
