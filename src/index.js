import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import Pool from './connection/conexao.js';
import router from './Router/rotas.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

app.listen(3000, async () =>{
    const conexao = await Pool.getConnection();
    try{
        console.log(`Servidor conectado! ${conexao.threadId}`);
    }catch(erro){
        console.error(`Erro ao conectar o servidor: ${erro.message}`);
    } finally{
        conexao.release();
    }
})