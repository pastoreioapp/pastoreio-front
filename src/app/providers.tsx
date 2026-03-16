"use client";

import ProviderStore from "@/ui/stores/ProviderStore";
import ProviderTheme from "@/ui/utils/ProviderTheme";
import AuthProvider from "@/ui/components/auth/AuthProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt";
import { SnackbarProvider } from "notistack";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <ProviderStore>
        <AuthProvider>
          <ProviderTheme>
            <SnackbarProvider>{children}</SnackbarProvider>
          </ProviderTheme>
        </AuthProvider>
      </ProviderStore>
    </LocalizationProvider>
  );
}
