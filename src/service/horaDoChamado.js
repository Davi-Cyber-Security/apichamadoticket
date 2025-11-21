export function horaDoChamado(){
    return new Date().toLocaleTimeString("pt-BR", {timeZone: "America/Sao_Paulo"});
}

console.log(horaDoChamado());