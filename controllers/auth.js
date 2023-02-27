const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const nodemailer = require('nodemailer');

/* Crear Usuario */
const crearUsuario = async (req, resp = response) => {
    try {
        const { email, clave, identificacion, tipoUsuario } = req.body;

        if (tipoUsuario === "Medico") {
            return resp.status(200).json({
                ok: false,
                msg: 'No se puede registrar este tipo de usuario'
            })
        }

        let usuario = await Usuario.findOne({ identificacion });
        if (usuario) {
            return resp.status(200).json({
                ok: false,
                msg: 'Ya existe un usuario registrado con esa identificación'
            })
        }

        usuario = await Usuario.findOne({ email });
        if(usuario) {
            return resp.status(200).json({
                ok: false,
                msg: 'Ya existe un usuario registrado con ese email'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.clave = bcrypt.hashSync(clave, salt);

        await usuario.save();

        return resp.status(201).json({
            ok: true,
            msg: 'Registro de usuario exitoso',
            uid: usuario.id,
            nombre: usuario.nombre
        });
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error al crear el usuario'
        })
    }
}

const crearMedico = async (req, resp = response) => {
    try {
        const { email, clave, identificacion } = req.body;
        const idHospital =  req.usuario._id
        let usuario = await Usuario.findOne({ identificacion });

        if (usuario) {
            return resp.status(200).json({
                ok: false,
                msg: 'Ya existe un usuario registrado con esa identificación'
            })
        }

        usuario = await Usuario.findOne({ email });
        if(usuario) {
            return resp.status(200).json({
                ok: false,
                msg: 'Ya existe un usuario registrado con ese email'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.clave = bcrypt.hashSync(clave, salt);
        usuario.idHospital = idHospital;

        console.log(usuario);

        await usuario.save();

        return resp.status(201).json({
            ok: true,
            msg: 'Registro de medico exitoso',
            uid: usuario.id,
            nombre: usuario.nombre
        });
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error al crear el medico'
        })
    }
}

/*  Login  */
const loginUsuario = async (req, resp = response) => {
    try {
        const { identificacion, clave } = req.body;

        let usuario = await Usuario.findOne({ identificacion });

        if (!usuario){
            return resp.status(201).json({
                ok: false,
                msg: 'Usuario o contraseña erradas'
            });
        }

        if(usuario){
            //confirmar contraseña
            const validPassword = bcrypt.compareSync(clave, usuario.clave);
            
            if (!validPassword) {
                return resp.status(201).json({
                    ok: false,
                    msg: 'Usuario o contraseña erradas'
                });
            }

            if (!usuario.verificado) {
                return resp.status(201).json({
                    ok: false,
                    msg: 'Debe verificar su cuenta para iniciar sesión'
                });
            }

            if (usuario.cambioPassword) {
                return resp.status(201).json({
                    ok: false,
                    msg: 'Primero debe cambiar su contraseña para poder iniciar sesión'
                });
            }

            const token = await generarJWT(usuario.id);

            return resp.json({
                ok: true,
                msg: 'Sesión Iniciada',
                uid: usuario.identificacion,
                nombre: usuario.nombre,
                token
            });
        }
    } catch(error) {
        return resp.status(500).json({
            ok: false,
            msg: 'Error al autenticar'
        });
    }
}

const solicitarVerificacion = async (req, resp = response) => {
    try {
        const { identificacion } = req.body;
        let usuario = await Usuario.findOne({identificacion});

        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'No se encontró ningún usuario con ese identificador',
            });
        }

        if (usuario.verificado) {
            return resp.status(200).json({
                ok: false,
                msg: 'El usuario ya está verificado',
            });
        }
        
        const tokenVerificacion = await generarJWT(identificacion);
        usuario.token = tokenVerificacion;
        await usuario.save();

        const transporter = nodemailer.createTransport({
            service : "hotmail",
            auth : {
                user : process.env.USER,
                pass : process.env.PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.USER,
            to: usuario.email,
            subject: 'Test de confirmacion',
            text: `Hola ${usuario.nombre}, haz clic en este enlace para verificar tu cuenta de Heippi: ${process.env.CLIENT_URL}/auth/verify/${tokenVerificacion}`
        };

        await transporter.sendMail(mailOptions);

        return resp.status(200).json({
            ok: true,
            msg: `Se ha enviado un correo electrónico para verificar tu cuenta a ${usuario.email}`,
        });
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error al solicitar la verificación tu cuenta',
        });
    }
}

const verificarCuenta = async (req, resp = response) => {
    try {
        const token = req.params.token;
        const usuario = await Usuario.findOne({ token });

        if (!usuario) {
          // No se encontró ningún usuario con el token de verificación proporcionado
            return resp.status(400).json({
                ok: false,
                msg: 'Token de verificación inválido o expirado',
            });
        }

        // Verificar la cuenta del usuario
        usuario.verificado = true;
        usuario.token = "";
        await usuario.save();

        return resp.status(200).json({
            ok: true,
            msg: 'La cuenta ha sido verificada correctamente',
        });
    } catch (error) {
        return resp.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error al verificar la cuenta',
        });
    }
}

const restablecerPassword = async (req, resp = response) => {
    try {
        const { identificacion } = req.body;
        let usuario = await Usuario.findOne({identificacion});

        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'No se encontró ningún usuario con ese identificador',
            });
        }

        const tokenVerificacion = await generarJWT(identificacion);
        usuario.token = tokenVerificacion;
        await usuario.save();

        const transporter = nodemailer.createTransport({
            service : "hotmail",
            auth : {
                user : process.env.USER,
                pass : process.env.PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.USER,
            to: usuario.email,
            subject: 'Test de restablecimiento de contraseña',
            text: `Hola ${usuario.nombre}, haz clic en este enlace para restablecer tu contraseña de Heippi: ${process.env.CLIENT_URL}/auth/reset-password/${tokenVerificacion}`
        };

        await transporter.sendMail(mailOptions);

        return resp.status(200).send(`Se ha enviado un correo electrónico para verificar tu cuenta a ${usuario.email}`);
    } catch (error) {
        resp.status(500).send('Ha ocurrido un error al solicitar recuperación de contraseña');
    }
}


const actualizarPassword = async (req, resp = response) => {
    try {
        const { clave } = req.body;
        const { token } = req.params;
        let usuario = await Usuario.findOne({ token });

        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Token de verificación inválido o expirado',
            });
        }

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.clave = bcrypt.hashSync(clave, salt);
        usuario.token = "";

        usuario = await Usuario.findByIdAndUpdate(usuario.id, usuario, { new: true });

        if (usuario.cambioPassword) {
            usuario.cambioPassword = false;
            await usuario.save();
        }

        return resp.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada de manera exitosa',
        });
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'error al cambiar la contraseña',
        });
    }
}

/**get Usuario By ID */
const getUsuarioById = async (req, resp = response) => {
    try {
        const {id} = req.params;
        const usuario = await Usuario.findById(id);
        resp.status(200).json({
            ok: true,
            msg: 'Usuario',
            usuario
        });
    } catch (error) {
        console.log(error);
        resp.status(400).json({
            ok: false,
            msg: 'error al listar Usuario',
        });
    }
}

const actualizarUsuario = async (req, resp = response) => {
    const usuarioId = req.params.id;
    try {
        
        const usuario = await Usuario.findById(usuarioId);

        if(!usuario) {
            return resp.status(201).json({
                ok: false,
                msg: 'El id no coincide con ningun registro en la base de datos',
            });
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, req.body, {new: true});

        return resp.status(200).json({
            ok: true,
            msg: 'Usuario actualizado exitosamente',
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        return resp.status(400).json({
            ok: false,
            msg: 'error al actualizar usuario',
        });
    }
}


const revalidarToken = async (req, resp = response) => {

    const { uid } = req;
    //generar nuevo token
    const token = await generarJWT(uid);

    return resp.status(200).json({
        ok: true,
        token: token
    });
}

module.exports = {
    crearUsuario,
    crearMedico,
    loginUsuario,
    revalidarToken,
    solicitarVerificacion,
    verificarCuenta,
    restablecerPassword,
    actualizarPassword,
    getUsuarioById,
    actualizarUsuario,
}
