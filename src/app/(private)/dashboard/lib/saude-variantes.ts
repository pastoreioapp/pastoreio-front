import type { SaudeCelulaResult } from "@/modules/celulas/application/saude-dtos";

export type SaudeVariante = "boa" | "media" | "ruim";

export interface SaudeVarianteTokens {
    variante: SaudeVariante;
    background: string;
    chipBg: string;
    versiculoColor: string;
    divisorColor: string;
    linkColor: string;
    icone: {
        src: string;
        alt: string;
    };
}

// Mapeia as 4 classes do domínio (florescendo/saudavel/atencao/critica) para
// as 3 variantes visuais definidas no design (boa/media/ruim).
export function variantePorClasse(classe: SaudeCelulaResult["classe"]): SaudeVariante {
    if (classe === "florescendo" || classe === "saudavel") return "boa";
    if (classe === "atencao") return "media";
    return "ruim";
}

// Tokens extraídos do Figma (Pastore.io) — frames:
//  - boa:    node 2342:3020
//  - media:  node 1472:3138
//  - ruim:   node 1472:3121
export const SAUDE_VARIANTES: Record<SaudeVariante, SaudeVarianteTokens> = {
    boa: {
        variante: "boa",
        background: "linear-gradient(180deg, #7FB77E 0%, #4A845D 100%)",
        chipBg: "rgba(255,255,255,0.2)",
        versiculoColor: "#F4F4F4",
        divisorColor: "rgba(255,255,255,0.3)",
        linkColor: "#FFFFFF",
        icone: {
            src: "/images/saude-celula/saude-boa.svg",
            alt: "Broto crescendo, indicando célula saudável",
        },
    },
    media: {
        variante: "media",
        background: "linear-gradient(180deg, #F9A825 0%, #C17900 100%)",
        chipBg: "rgba(255,255,255,0.22)",
        versiculoColor: "#FFF5E0",
        divisorColor: "rgba(255,255,255,0.32)",
        linkColor: "#FFFFFF",
        icone: {
            src: "/images/saude-celula/saude-media.svg",
            alt: "Sol entre nuvens, indicando célula em atenção",
        },
    },
    ruim: {
        variante: "ruim",
        background: "linear-gradient(180deg, #E57373 0%, #B71C1C 100%)",
        chipBg: "rgba(255,255,255,0.22)",
        versiculoColor: "#FBE7E6",
        divisorColor: "rgba(255,255,255,0.32)",
        linkColor: "#FFFFFF",
        icone: {
            src: "/images/saude-celula/saude-ruim.svg",
            alt: "Tempestade com raio e chuva, indicando célula em estado crítico",
        },
    },
};
