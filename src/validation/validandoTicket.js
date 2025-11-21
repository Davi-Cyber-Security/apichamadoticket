import Pool from "../connection/conexao.js";


export async function validandoTicket(ticket){
    const conexao = await Pool.getConnection();

    try{
        const [validandoNoBanco] = await conexao.execute("SELECT 1 FROM ticket WHERE public_id = ?", [ticket]);
        return validandoNoBanco.length === 0;
    } catch(error){
        console.log(`Erro ao valiadar o ticket ${error}`);
        return false;
    } finally{
        conexao.release();
    }
}