const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

const { loginUsuario, crearUsuario, crearMedico, revalidarToken, actualizarUsuario, actualizarPassword, getUsuarioById, solicitarVerificacion, verificarCuenta, restablecerPassword } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar-campos');
const { HospitalUser } = require('../middlewares/validar-tipos');
const { validarJWT } = require('../middlewares/validar-jwt');


router.post(
    '/register', 
    [
        check('identificacion','La identificación debe tener al menos 7 caracteres').isLength({min:7}),
        check('nombre','El nombre es obligatorio').not().isEmpty().trim(),
        check('email', 'El email es obligatorio').isEmail(),
        check('telefono','El telefono debe ser de 10 caracteres').isLength({min:10}),
        check('clave', 'la clave debe ser de al menos 6 caracteres').isLength({min:6}),
        check('direccion', 'la direccion es obligatoria').not().isEmpty().trim(),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/register/medico', 
    [
        check('identificacion','La identificación debe tener al menos 7 caracteres').isLength({min:7}),
        check('nombre','El nombre es obligatorio').not().isEmpty().trim(),
        check('email', 'El email es obligatorio').isEmail(),
        check('telefono','El telefono debe ser de 10 caracteres').isLength({min:10}),
        check('clave', 'la clave debe ser de al menos 6 caracteres').isLength({min:6}),
        check('direccion', 'la direccion es obligatoria').not().isEmpty().trim(),
        validarCampos
    ],
    validarJWT,
    HospitalUser,
    crearMedico
);

router.post(
    '/login',
    [
        check('identificacion','La identificación es obligatoria').not().isEmpty().trim(),
        check('clave', 'La clave es obligatoria y debe tener al menos 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUsuario
);

router.post(
    '/request-verification', 
    [
        check('identificacion','La identificación es obligatoria').not().isEmpty().trim(),
        validarCampos
    ],
    solicitarVerificacion
);

router.get(
    '/verify/:token',
    verificarCuenta
);


router.post(
    '/forgot-password',
    [
        check('identificacion','La identificación es obligatoria').not().isEmpty().trim(),
        validarCampos
    ],
    restablecerPassword
);

router.put('/reset-password/:token',
    [
        check('clave', 'La clave es obligatoria y debe tener al menos 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    actualizarPassword
);

router.put('/update/:id',
    [
        check('nombre','EL nombre es obligatorio').not().isEmpty().trim(),
        check('apellidos','EL apellido es obligatorio').not().isEmpty().trim(),
        check('email', 'El email es obligatorio').isEmail(),
        check('telefono','El telefono debe ser de 10 caracteres').isLength({min:10}),
        check('documento','El documenot debe tener al menos 7 caracteres').isLength({min:7}),
        check('fechaNacimiento','La fecha de nacimiento es obligatoria').not().isEmpty(),
        validarCampos
    ],
    validarJWT,
    actualizarUsuario
);

router.get('/profile/:id',
    validarJWT,
    getUsuarioById
);

router.post('/renew', validarJWT, revalidarToken);

module.exports = router;