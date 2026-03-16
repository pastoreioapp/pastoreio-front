import Providers from "./providers";
import { poppins } from "@/ui/utils/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className={poppins.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
