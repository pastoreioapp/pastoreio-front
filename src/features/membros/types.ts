interface Pastoreio1 {
    assiduoCulto: boolean;
    assiduoCelula: boolean;
    livroAcompInicial: boolean;
    cafeComPastor: boolean;
    cursoNovaCriatura: boolean;
    batismoAguas: boolean;
}

interface Pastoreio2 {
    cursoVidaDevocional: boolean;
    cursoAutSubmissao: boolean;
    servirEmMinisterio: boolean;
    encontroComDeus: boolean;
}

interface DiscipuladoFlags {
    assiduoTadel: boolean;
    cursoIdeFazeiDiscipulo: boolean;
    expresso1: boolean;
}

interface LiderCelula {
    cursoTlc: boolean;
    expresso2: boolean;
    aprovacaoPastor: boolean;
}

interface Trajetoria {
    pastoreio1: Pastoreio1;
    pastoreio2: Pastoreio2;
    discipuladoFlags: DiscipuladoFlags;
    liderCelula: LiderCelula;
}

export interface Membro {
    nome: string;
    funcao: string;
    telefone: string;
    email: string;
    nascimento: string;
    endereco: string;
    estadoCivil: string;
    conjuge: string;
    filhos: "Sim" | "Não";
    discipulador: string;
    discipulando: string;
    ministerio: string;
    trajetoria: Trajetoria;
}
