const MESES_EXTENSO = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

// Converte "YYYY-MM-DD" em "dd/mm" sem depender do fuso horário do navegador.
export function formatarDataCurta(data: string): string {
    const partes = data.slice(0, 10).split("-");
    if (partes.length !== 3) return data;
    const [, mes, dia] = partes;
    return `${dia}/${mes}`;
}

// Converte "YYYY-MM-DD" em "dd/mm/yyyy" sem depender do fuso horário do navegador.
export function formatarDataCompleta(data: string): string {
    const partes = data.slice(0, 10).split("-");
    if (partes.length !== 3) return data;
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
}

// "dd 'de' MMMM" para uso em tooltips e descrições, em português.
export function formatarDataExtensa(data: string): string {
    const partes = data.slice(0, 10).split("-");
    if (partes.length !== 3) return data;
    const [, mes, dia] = partes;
    const indiceMes = Number(mes) - 1;
    const nomeMes = MESES_EXTENSO[indiceMes] ?? mes;
    return `${Number(dia)} de ${nomeMes}`;
}

function toIsoLocal(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

// Retorna o intervalo da semana ISO 8601 (segunda a domingo) que contém `hoje`,
// formatado como strings YYYY-MM-DD no fuso local.
export function obterIntervaloSemanaIso(
    hoje: Date = new Date()
): { inicio: string; fim: string } {
    const diaSemana = hoje.getDay();
    // getDay(): 0 = domingo, 1 = segunda, ..., 6 = sábado
    // ISO: segunda é o primeiro dia da semana
    const offsetSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;

    const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + offsetSegunda);
    const domingo = new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + 6);

    return {
        inicio: toIsoLocal(segunda),
        fim: toIsoLocal(domingo),
    };
}

// Verifica se uma data ISO (YYYY-MM-DD) cai dentro da semana ISO atual.
// Usa comparação lexicográfica de strings para evitar problemas de fuso.
export function estaNaSemanaAtual(dataIso: string, hoje: Date = new Date()): boolean {
    const data = dataIso.slice(0, 10);
    const { inicio, fim } = obterIntervaloSemanaIso(hoje);
    return data >= inicio && data <= fim;
}
