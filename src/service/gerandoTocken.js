import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function GerarToken(payload = {idUsuario: 2}){
    const usuarioLogado = {"idUsuario": 1};

    return jwt.sign(payload, process.env.TOKEN, {expiresIn: '30m'});
}