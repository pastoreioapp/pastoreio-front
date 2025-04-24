import ProviderStore from "./ProviderStore";
import ProviderTheme from "./ProviderTheme";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>
                <ProviderStore>
                    <ProviderTheme>{children}</ProviderTheme>
                </ProviderStore>
            </body>
        </html>
    );
}
