const { response } = require('express');

const HospitalUser = async (req, resp = response, next) => {
    if(!req.usuario){
        return resp.status(400).json({
            ok: false,
            msg: 'Se quiere validar el rol sin validar el token'
        });
        
    }
    
    const {nombre, tipoUsuario} = req.usuario;

    if (tipoUsuario !== 'Hospital'){
        return resp.status(200).json({
            ok: false,
            msg: `${nombre} no está permitido para realizar está acción`
        });
    }

    next();
}


const MedicoUser = async (req, resp = response, next) => {
    if(!req.usuario){
        return resp.status(400).json({
            ok: false,
            msg: 'Se quiere validar el rol sin validar el token'
        });
        
    }
    
    const {nombre, tipoUsuario} = req.usuario;

    if (tipoUsuario !== 'Medico'){
        return resp.status(200).json({
            ok: false,
            msg: `${nombre} no está permitido para realizar está acción`
        });
    }

    next();
}


module.exports = {
    HospitalUser,
    MedicoUser
}