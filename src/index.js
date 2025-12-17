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

app.get('/api/cron', async (req, res) => {
  try {
    await Pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (erro) {
    console.error('Erro na rota /api/cron:', erro);
    res.status(500).json({ ok: false, error: erro.message });
  }
});

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