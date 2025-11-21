import { nanoid } from "nanoid";
import Pool from "../connection/conexao.js";

function gerandoId(){
    return nanoid(12);
}

async function validandoSeExisteIdGerado(){
    const conexao = await Pool.getConnection();

    let idGerado;
    let idExiste = true;

    try{
        while(idExiste){
            idGerado = gerandoId();

            const [validandoNoBanco] = await conexao.query("SELECT 1 FROM ticket WHERE public_id = ?", [idGerado]);

            idExiste = validandoNoBanco.length > 0;
        }

        return idGerado;
    } finally{
        conexao.release();
    }
}


export async function idGerado(){
    try{
        return await validandoSeExisteIdGerado();
    } catch(error){
        console.log(`Erro em idGerado: ${error}`);
        return{
            erro: true,
            mensagem: "Erro interno ao gerar ID"
        }
    }
}