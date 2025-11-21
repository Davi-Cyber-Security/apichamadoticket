import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function validandoLogin(token){
    try {
        const dadosToken = jwt.verify(token, process.env.TOKEN);
        if (dadosToken && dadosToken.idUsuario) {
            return { status: true, codigo: 200, usuario: dadosToken };
        }
        return { status: false, codigo: 401 };
    } catch (err) {
        return { status: false, codigo: 401 };
    }
}