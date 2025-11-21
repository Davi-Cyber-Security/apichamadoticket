import { departamentos } from "../lib/departamentos.js";

export function departamentoValido(departamento){
    return departamentos.some(dep => dep.toLowerCase() === departamento.toLowerCase());
}

