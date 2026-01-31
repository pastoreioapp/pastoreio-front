/**
 * Valida se a string é um email válido.
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Remove caracteres não numéricos do telefone.
 */
function extractDigits(phone: string): string {
    return phone.replace(/\D/g, "");
}

/**
 * Formata telefone para o padrão E.164 (ex: +5511999999999).
 * Aceita formatos: 11999999999, (11) 99999-9999, +55 11 99999-9999, etc.
 */
export function formatPhoneToE164(phone: string, defaultCountryCode = "55"): string {
    const digits = extractDigits(phone);

    // Se já tem código do país (55 para Brasil)
    if (digits.startsWith("55") && digits.length >= 12) {
        return `+${digits}`;
    }

    // Assume Brasil se tiver 10 ou 11 dígitos (DDD + número)
    if (digits.length === 10 || digits.length === 11) {
        return `+${defaultCountryCode}${digits}`;
    }

    return `+${defaultCountryCode}${digits}`;
}

/**
 * Valida se o telefone é válido para registro.
 * Aceita formatos brasileiros: 10 dígitos (fixo) ou 11 dígitos (celular).
 */
export function isValidPhone(phone: string): boolean {
    const digits = extractDigits(phone);

    // Com código do país 55: 12 ou 13 dígitos
    if (digits.startsWith("55")) {
        const localDigits = digits.slice(2);
        return localDigits.length === 10 || localDigits.length === 11;
    }

    // Sem código: 10 (fixo) ou 11 (celular) dígitos
    return digits.length === 10 || digits.length === 11;
}

/**
 * Retorna mensagem de erro de validação para o campo de senha.
 * Exige mínimo de 6 caracteres.
 */
export function getPasswordValidationError(password: string | undefined): string | null {
    if (!password) {
        return "Campo obrigatório";
    }
    return password.length < 6 ? "A senha deve ter pelo menos 6 caracteres" : null;
}

/**
 * Retorna mensagem de erro de validação para o campo de login.
 */
export function getLoginValidationError(
    value: string | undefined,
    type: "email" | "phone"
): string | null {
    if (!value || !value.trim()) {
        return "Campo obrigatório";
    }
    const trimmed = value.trim();
    if (type === "email") {
        return isValidEmail(trimmed) ? null : "Digite um email válido";
    }
    return isValidPhone(trimmed) ? null : "Digite um telefone válido (ex: 11 99999-9999)";
}
