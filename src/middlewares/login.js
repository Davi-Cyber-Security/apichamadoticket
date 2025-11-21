import { validandoLogin } from "../security/validacaoLogin.js";

export function Login(req, res, next){
    let token;

    if(typeof req.headers.authorization !== 'undefined'){
        token = req.headers.authorization.split(' ')[1];
    } else{
        return res.status(401).json({erro: "Login inválido!"});
    }

    const tokenValido = validandoLogin(token);

    if (!tokenValido.status) {
        return res.status(tokenValido.codigo).json({ erro: 'Login inválido!' });
    }

    req.usuario = tokenValido.usuario || null;
    return next();
}