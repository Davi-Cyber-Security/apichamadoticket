import Pool from "../connection/conexao.js";

export async function consultandoIdBancoMySQL(id){
    const conexao = await Pool.getConnection();

    try{
        const [consultando] = await conexao.execute("SELECT*FROM ticket WHERE public_id = ?", [id]);
        
        if(consultando.length === 0) return false;

        return true;
    } catch(error){
        console.log(`Erro ao fazer a Consulta do validandoIdDoBancoDeDados: ${error}`);
    } finally{
        conexao.release();
    }
}