import palavroes  from "../lib/palavroes.js";

export function validandoPalavroes(texto){
    const palavrasNoTexto = texto.toLowerCase().split(/\s+/);
    return palavroes.map(p => p.toLocaleLowerCase()).some(p => palavrasNoTexto.includes(p));
}