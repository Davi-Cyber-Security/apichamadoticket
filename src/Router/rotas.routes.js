import express from 'express';

import { cadastroTicket, retornandoTodosOsDados, retornandoIdEquipamento, retornandoDepartamento, retornandoStatus, retornandoDadosPorNome_e_Data, atendendoChamado, retornandoTicket, cancelarTicket } from '../service/servico.js';
import { Login } from '../middlewares/login.js';
import { FazerLogin } from '../service/fazerLogin.js';

const router = express.Router();


router.post('/cadastro', cadastroTicket);
router.get('/tickets', retornandoTodosOsDados);
router.get('/buscarIdEquipamento', retornandoIdEquipamento);
router.post('/departamento', retornandoDepartamento);
router.post('/status', retornandoStatus);
router.post('/buscarnomedata', retornandoDadosPorNome_e_Data);
router.post('/ticket', retornandoTicket);
router.post('/login', FazerLogin);
router.patch('/atendendoTicket',atendendoChamado);
router.patch('/cancelarTicket', cancelarTicket);

router.use((req, res) =>{
    return res.status(404).json({Erro: "Endereço não encontrado."});
})

export default router;