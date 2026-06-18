import type { Tendencia } from "@/modules/celulas/application/dashboard-dtos";

export function rotularTendencia({ direcao, intensidade }: Tendencia): string {
    if (direcao === "estavel") return "estável";
    return `${direcao} ${intensidade}`;
}
