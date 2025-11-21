import { bibliotecaStatus } from "../lib/status.js";

export function validandoStatus(status){
    if(typeof status !== 'string' || undefined || null) return false;
    return bibliotecaStatus.some(palavra => status.toLowerCase() === palavra.toLowerCase());
}