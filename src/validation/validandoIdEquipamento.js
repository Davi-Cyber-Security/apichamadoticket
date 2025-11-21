function equipamentoMaiorQueZero(idEquipamento){
    return idEquipamento.toString().length <= 0;
}

function equipamentoNumero(idEquipamento){
    return typeof idEquipamento !== "string";
}

function tamanhoMaximoIdEquipamento(idEquipamento){
    return idEquipamento.toString().length > 15;
}

export function validandoIdEquipamento(idEquipamento){
    return equipamentoMaiorQueZero(idEquipamento) || equipamentoNumero(idEquipamento) || tamanhoMaximoIdEquipamento(idEquipamento);
}