export function validandoIdParametro(id){
    const regex = /^[1-9]\d*$/;

    if(!regex.test(id)) return true;

    return false;
}