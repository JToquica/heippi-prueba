const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { MedicoUser, HospitalUser } = require('../middlewares/validar-tipos');

//Controllers
const { getObservacionByMedicosHospital, getObservacionByIdPaciente, getObservacionByIdMedico, crearObservacion, generarReporte } = require('../controllers/observacion');

//Rutas
router.get('/', validarJWT, getObservacionByIdPaciente);
router.get('/generar-reporte/:id', generarReporte);
router.get('/medico', validarJWT, MedicoUser, getObservacionByIdMedico);
router.get('/hospital', validarJWT, HospitalUser, getObservacionByMedicosHospital);

router.post(
    '/create', 
    [
        check('observacion','La observacion es obligatoria').not().isEmpty(),
        check('estadoSalud','El estado de salud es obligatorio').not().isEmpty(),
        check('especialidadMedica','La especialidad medica es obligatoria').not().isEmpty(),
        check('idPaciente','El id del paciente es obligatorio').not().isEmpty(),
        validarCampos
    ],
    validarJWT,
    MedicoUser,
    crearObservacion
);

module.exports = router;