import Pool from "../connection/conexao.js";

import { mensagem }  from "../lib/error/mensagensError.js";
import { validandoNome } from "../validation/validandoNome.js";
import { departamentoValido } from "../validation/departamento.js";
import { validandoProblema } from "../validation/problema.js";
import { validandoIdEquipamento } from "../validation/validandoIdEquipamento.js";
import { removendoEspacos } from './removendoEspacos.js';
import { dataDoChamado } from "./dataDoChamado.js";
import { horaDoChamado } from "./horaDoChamado.js";
import { consultandoIdBancoMySQL } from "./validandoIdDoBancoDeDados.js"; 
import { validandoStatus } from "../validation/validandoStatus.js";
import { idGerado } from "./gerandoId.js";
import { validandoTicket } from "../validation/validandoTicket.js";
import { validandoCancelamentoTicket } from "../validation/validandoCancelamentoTicket.js";
import { validandoPalavroes } from "../validation/validandoPalavroes.js";
import {tamanhoMaxDeCaracteres} from "../validation/validandoRespostaSuporte.js";

export async function cadastroTicket(req, res){

    const { nome, idEquipamento, departamento, problema } = req.body;
    const publicID = await idGerado();
    const conexao = await Pool.getConnection();
    const status = "em andamento";  
    const respostaDoSuporte = "Aguardando resposta do suporte...";

    try{
        if(validandoNome(removendoEspacos(nome))){
            return res.status(mensagem.nomeInvalido.status).json(mensagem.nomeInvalido.mensagem);
        }
        if(validandoIdEquipamento(removendoEspacos(idEquipamento))){
            return res.status(mensagem.idEquipamentoInvalido.status).json(mensagem.idEquipamentoInvalido.mensagem);
        }
        if(!departamentoValido(removendoEspacos(departamento))){
            return res.status(mensagem.departamentoInvalido.status).json(mensagem.departamentoInvalido.mensagem);
        }
        if(validandoProblema(removendoEspacos(problema))){
            return res.status(mensagem.problemaInvalido.status).json(mensagem.problemaInvalido.mensagem);
        }
        if(publicID?.erro){
            return res.status(mensagem.erroInterno.status).json(publicID.mensagem);
        }

        const adicionando = await conexao.query("INSERT INTO ticket (nome, idequipamento, departamento, problema, status, dataTicket, horaTicket, public_id, respostadosuporte) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [removendoEspacos(nome), removendoEspacos(idEquipamento), removendoEspacos(departamento.toUpperCase()), removendoEspacos(problema), status, dataDoChamado(), horaDoChamado(), publicID, respostaDoSuporte]);
        
        if(adicionando.affectedRows === 0){
            console.log(`Erro ao adicionar o chamado ao banco de dados: ${adicionando}`);
            return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
        }

        return res.status(201).json({message: `Ticket gerado: ${publicID}`});
    } catch(error){
        console.log(`Erro ao criar chamado: ${error}`);
        return res.status(mensagem.erroInterno.status).json({message: mensagem.erroInterno.mensagem});
    } finally{
        conexao.release();
    }
}

export async function cancelarTicket(req, res){
    const conexao = await Pool.getConnection();
    const {ticket} = req.body;
    const dataDoCancelamento = new Date().toLocaleDateString();
    const horaDoCancelamento = new Date().toLocaleTimeString();
    const respostadosuporte = "Ticket cancelado pelo usuário";

    try{
        if(await validandoCancelamentoTicket(ticket)) return res.status(400).json({Mensagem: "Ticket inválido ou não encontrado"});

        const [cancelandoTicket] = await conexao.query("UPDATE ticket SET status = ?, dataCancelamentoUsuario = ?, horaDoCancelamentoUsuario = ?, respostadosuporte = ? WHERE public_id = ?", ["Cancelado", dataDoCancelamento, horaDoCancelamento, respostadosuporte, ticket]);

        return res.status(200).json({Mensagem: "Ticket Cancelado com sucesso!"});
    } catch(error){
        console.log(`Erro ao fazer o cancelamento do Ticket: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}

export async function retornandoTodosOsDados(req, res){
    const conexao = await Pool.getConnection();

    try{
        const retornando = await conexao.query("SELECT * FROM ticket ORDER BY id DESC");
        return res.status(200).json(retornando[0]);
    } catch(error){
        console.log(`Erro interno ao retornar todos os tickets: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}

export async function retornandoIdEquipamento(req, res){
    const conexao = await Pool.getConnection();
    const {IdEquipamento} = req.body;

    try{
        if(!IdEquipamento || Object.keys(IdEquipamento).length === 0) return res.status(400).json({Mensagem: "Campo do ID do equipamento obrigatório."});

        const [buscandoIdDoEquipamento] = await conexao.execute("SELECT * FROM ticket WHERE idequipamento = ?", [IdEquipamento]);

        if(buscandoIdDoEquipamento.length === 0)
            return res.status(mensagem.rotaNaoEncontrada.status).json({Mensagem: "Nenhum equipamento foi encontrado"});

        return res.status(200).json(buscandoIdDoEquipamento);
    } catch(error){
        console.log(`Erro ao retornar Id do equipamento: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}

export async function retornandoDepartamento(req, res){
    const conexao = await Pool.getConnection();
    const { departamento } = req.body;

    try{
        if(!departamento || Object.keys(departamento).length === 0) return res.status(400).json({Mensagem: "Campo obrigatório."});
        if(!departamentoValido(departamento)) return res.status(400).json({Mensagem: `Departamento buscado: ${departamento} inválido.`});

        const [buscandoDeparmento] = await conexao.execute("SELECT * FROM ticket WHERE departamento = ?", [departamento]);
        
        if(buscandoDeparmento.length === 0) return res.status(mensagem.rotaNaoEncontrada.status).json({Mensagem: `Departamento: ${departamento} não encontrado.`});

        return res.status(200).json(buscandoDeparmento);
    } catch(error){
        console.log(`Erro ao buscar por Departamento: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}

export async function retornandoStatus(req, res){
    const conexao = await Pool.getConnection();
    const {status} = req.body;

    try{
        if(!status) return res.status(400).json({Mensagem: "Campo Status é obrigatório."});
        if(!validandoStatus(status)){
            return res.status(400).json({Mensagem: `Tipo de status: ${status} não encontrada!`});
        }

        const [retornandoStatus] = await conexao.query("SELECT*FROM ticket WHERE status = ?", [status]);
        
        if(retornandoStatus.length === 0) return res.status(404).json({mensagem: `Status: ${status} não encontrado`});

        return res.status(200).json(retornandoStatus);
    } catch(error){
        console.log(`Erro ao retornar Status: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}

export async function retornandoDadosPorNome_e_Data(req, res){
    const conexao = await Pool.getConnection();
    const {nome, data} = req.body;

    try {
        if(validandoPalavroes(nome)) return res.status(400).json({Mensagem: "Palavrões são estritamente proibidas."});
        if(!nome || !data) return res.status(400).json({Mensagem: "Campo nome e data obrigatórios!"})
        
        const [retornando] = await conexao.execute("SELECT * FROM ticket WHERE nome = ? AND dataTicket = ?", [nome, data]);

        if(retornando.length === 0) return res.status(404).json({Mensagem: "Dados não encontrado!"});

        return res.status(200).json(retornando);
    } catch (error) {
        console.log(`Erro ao retornar nome: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}

export async function retornandoTicket(req, res){
    const conexao = await Pool.getConnection();
    const {ticket} = req.body;

    try{
        if(!ticket || Object.keys(ticket).length === 0) return res.status(400).json({Mensagem: "Campos obrigatórios estão faltando."});
        if(await validandoTicket(ticket)) return res.status(400).json({Mensagem: "Ticket não encontrado"});

        const [retornandoTicket] = await conexao.query("SELECT*FROM ticket WHERE public_id = ?", [ticket]);

        return res.status(200).json(retornandoTicket)
    } catch(error){
        console.log(`Erro interno ao retornar Ticket: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}

export async function atendendoChamado(req, res){
    const conexao = await Pool.getConnection();
    const {buscarId, respostaDoSuporte, status} = req.body;
    const dataAtendimentoIniciado = `${dataDoChamado()} - ${horaDoChamado()}`;
    let dataAtendimentoFinalizado = "";

    try{
        if(!status){
            return res.status(400).json({Mensagem: "Os campos 'situação' e 'status' são obrigatórios."});
        }
        if(status == "Resolvido" || status == "Nao Resolvido"){
            dataAtendimentoFinalizado = `${dataDoChamado()} - ${horaDoChamado()}`;
        }
        if(!validandoStatus(status)){
            return res.status(400).json({Mensagem: `Selecione a opção correta!`});
        }
        if(!respostaDoSuporte || validandoPalavroes(respostaDoSuporte)){
            return res.status(400).json({Mensagem: "Não é permitido palavrões ou campo vazio!"});
        }
        if(tamanhoMaxDeCaracteres(respostaDoSuporte)) return res.status(400).json({Mensagem: "O campo 'resposta de suporte pode ter no máximo 5.000 caracteres."});
        if(consultandoIdBancoMySQL(buscarId)){
            const [atualizandoBanco] = await conexao.query("UPDATE ticket SET status = ?, respostadosuporte = ?, atendimentoIniciado = ?, atendimentoFinalizado = ?  WHERE public_id = ?", [status, respostaDoSuporte, dataAtendimentoIniciado, dataAtendimentoFinalizado, buscarId]);

            return res.status(200).json({Mensagem: `Status do ticket (${buscarId}) foi atualizado com sucesso!`});
        }

        return res.status(mensagem.rotaNaoEncontrada.status).json({Mensagem: `Busca pelo id: ${buscarId} não encontrado`});
    } catch(error){
        console.log(`Erro ao fazer atendimento de ticket: ${error}`);
        return res.status(mensagem.erroInterno.status).json(mensagem.erroInterno.mensagem);
    } finally{
        conexao.release();
    }
}