export function getInitials(nome?: string, sobrenome?: string): string {
    const nomeLimpo = nome?.trim() || "";
    const sobrenomeLimpo = sobrenome?.trim() || "";

    if (!nomeLimpo && !sobrenomeLimpo) {
        return "U";
    }

    if (!sobrenomeLimpo) {
        return nomeLimpo[0].toUpperCase();
    }

    return (nomeLimpo[0] + sobrenomeLimpo[0]).toUpperCase();
}
