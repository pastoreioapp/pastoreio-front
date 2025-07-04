interface Pastoreio1 {
    assiduo_culto: boolean;
    assiduo_celula: boolean;
    livro_acomp_inicial: boolean;
    cafe_com_pastor: boolean;
    curso_nova_criatura: boolean;
    batismo_aguas: boolean;
}

interface Pastoreio2 {
    curso_vida_devocional: boolean;
    curso_aut_submissao: boolean;
    servir_em_ministerio: boolean;
    encontro_com_deus: boolean;
}

interface DiscipuladoFlags {
    assiduo_tadel: boolean;
    curso_ide_fazei_discipulo: boolean;
    expresso_1: boolean;
}

interface LiderCelula {
    curso_tlc: boolean;
    expresso_2: boolean;
    aprovacao_pastor: boolean;
}

export interface Membro {
    nome: string;
    funcao: string;
    telefone: string;
    email: string;
    nascimento: string;
    endereco: string;
    estado_civil: string;
    conjuge: string;
    filhos: "Sim" | "Não";
    discipulador: string;
    discipulando: string;
    ministerio: string;
    pastoreio1: Pastoreio1;
    pastoreio2: Pastoreio2;
    discipulado_flags: DiscipuladoFlags;
    lider_celula: LiderCelula;
}
