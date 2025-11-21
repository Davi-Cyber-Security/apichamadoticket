import Pool from "../connection/conexao.js";
import { mensagem } from "../lib/error/mensagensError.js";

export async function validandoCancelamentoTicket(ticket){
    const conexao = await Pool.getConnection();

    try{
        if(!ticket || String(ticket).length === null || ticket === undefined || String(ticket).length < 12) return true;

        const [validandoTicket] = await conexao.query("SELECT * FROM ticket WHERE public_id = ?", [ticket]);
        return validandoTicket.length === 0;
    } catch(error){
        console.log(`Erro ao validar o cancelamento do ticket`);
    } finally{
        conexao.release();
    }
}