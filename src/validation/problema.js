import { validandoPalavroes } from "./validandoPalavroes.js";

function validandoSeEhString(problema){
    return typeof problema !== 'string';
}

function validandoTamanhoMinimo(problema){
    return problema.length <= 50;
}
    
function validandoTamanhoMaximo(problema){
    return problema.length > 10000;
}

export function validandoProblema(problema){
    console.log(validandoPalavroes(problema));
    if(validandoSeEhString(problema) || validandoTamanhoMinimo(problema) || validandoTamanhoMaximo(problema) || validandoPalavroes(problema)){
        return true;
    }
    return false;
}