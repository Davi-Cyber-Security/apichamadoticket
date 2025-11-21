export function dataDoChamado(){
    return new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo"});
}

export function horaDoChamado(){
    return new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo"});
}