import { validandoPalavroes } from "./validandoPalavroes.js";

function validarNomeMenorQueTresCaracteres(nome){
    return nome.length <= 3;
}

function validandoTipoNome(nome){
    return typeof nome !== "string";
}

function tamanhoMaximoNome(nome){
    return nome.length > 80;
}

function validandoSeContemPalavrao(nome){
    
}

export function validandoNome(nome){
    return validarNomeMenorQueTresCaracteres(nome) || validandoTipoNome(nome) || validandoPalavroes(nome) || tamanhoMaximoNome(nome);
}