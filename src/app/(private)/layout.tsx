import PrivateShell from "@/ui/components/layout/PrivateShell";

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <PrivateShell>{children}</PrivateShell>
    );
}
