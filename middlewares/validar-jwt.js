const { response, request } = require('express');

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const validarJWT = async (req = request, res = response, next) => {
    let token = '';
    token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(201).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRET_KEY);

        //Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        //Buscar si existe odontólogo y si existe mirar si está activo
        if (usuario) {
            req.usuario = usuario;
        } else {
            res.status(201).json({
                ok: false,
                msg: 'Token no valido'
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}