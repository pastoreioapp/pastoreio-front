export const VERSICULOS = [
    "\u201CAquele que permanece em Mim e Eu nele, esse dá muito fruto...\u201D João 15:5",
    "\u201CIrão de força em força; cada um deles aparecerá diante de Deus em Sião.\u201D Salmos 84:7",
    "\u201CE não nos cansemos de fazer o bem, pois no tempo certo colheremos, se não desanimarmos.\u201D Gálatas 6:9",
    "\u201CTudo posso naquele que me fortalece.\u201D Filipenses 4:13",
    "\u201CO Senhor é o meu pastor; nada me faltará.\u201D Salmos 23:1",
    "\u201CSede fortes e corajosos. Não temais, nem vos assusteis, porque o Senhor, o vosso Deus, vai com vocês.\u201D Deuteronômio 31:6",
    "\u201CAssim brilhe a luz de vocês diante dos homens, para que vejam as suas boas obras e glorifiquem ao Pai.\u201D Mateus 5:16",
    "\u201CPois onde estiverem dois ou três reunidos em meu nome, ali eu estou no meio deles.\u201D Mateus 18:20",
    "\u201CO amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.\u201D 1 Coríntios 13:4",
    "\u201CSomos mais do que vencedores, por meio daquele que nos amou.\u201D Romanos 8:37",
    "\u201CEm tudo somos mais que vencedores, por Aquele que nos amou.\u201D Romanos 8:37",
    "\u201CAmo o Senhor porque Ele ouve a minha voz e as minhas súplicas.\u201D Salmos 116:1",
    "\u201CConfie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.\u201D Provérbios 3:5",
    "\u201CEle renova as minhas forças. Guia-me pelos caminhos justos.\u201D Salmos 23:3",
    "\u201CO Senhor é bom; seu amor leal dura para sempre, e sua fidelidade por todas as gerações.\u201D Salmos 100:5",
];

export function versiculoDoDia(celulaId: number): string {
    const hoje = new Date();
    const seed = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate() + celulaId;
    const index = seed % VERSICULOS.length;
    return VERSICULOS[index];
}
