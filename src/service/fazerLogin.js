import Pool from '../connection/conexao.js';
import dotenv from 'dotenv';
import { GerarToken } from './gerandoTocken.js';

dotenv.config();

export async function FazerLogin(req, res){
    const { usuario, senha } = req.body;
    const conexao = await Pool.getConnection();
    
    try {
        if(!usuario || !senha){
            return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
        }

         const [consultarNoBanco] = await conexao.execute("SELECT id, usuario, senha FROM ticket WHERE usuario = ? AND senha = ?", [usuario, senha]);
         
         if(consultarNoBanco.length === 0){
            return res.status(401).json({erro: "Usuário ou senha inválidos."});
         }

         const user = consultarNoBanco[0];

        if(user.senha !== senha){
            return res.status(401).json({erro: "Usuário ou senha inválidos."});
        }

        const payload = {idUsuario: user.id, usuario: user.usuario};
        const token = GerarToken(payload);

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Erro no login: ", error);
        console.error("Stack trace: ", error.stack)
        return res.status(500).json({ erro: 'Configuração de autenticação ausente no servidor.' });
    } finally{
        if(conexao) conexao.release();
    }
}