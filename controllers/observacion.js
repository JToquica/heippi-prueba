const { response } = require('express');
const Observacion = require('../models/Observacion');
const Usuario = require('../models/Usuario');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const getObservacionByIdPaciente = async (req, resp = response) => {
    try {
        const idPaciente = req.usuario._id;
        const observaciones = await Observacion.find({idPaciente})
                                            .populate('idMedico')
                                            .populate('idPaciente');

        resp.status(200).json({
            ok: true,
            msg: 'Lista de observaciones',
            observaciones
        });
    } catch (error) {
        console.log(error);
        resp.status(400).json({
            ok: false,
            msg: 'error al listar observaciones',
        });
    }
}

const getObservacionByIdMedico = async (req, resp = response) => {
    try {
        const idMedico = req.usuario._id;
        const observaciones = await Observacion.find({idMedico})
                                            .populate('idMedico')
                                            .populate('idPaciente');

        resp.status(200).json({
            ok: true,
            msg: 'Lista de observaciones',
            observaciones
        });
        
    } catch (error) {
        console.log(error);
        resp.status(400).json({
            ok: false,
            msg: 'error al listar observaciones',
        });
    }
}

const getObservacionByMedicosHospital = async (req, resp = response) => {
    try {
        const idHospital = req.usuario._id;
        const medicos = await Usuario.find({idHospital});

        let observacionesMedicos = {};

        for await(let medico of medicos){
            let observaciones = await Observacion.find({idMedico: medico._id }).populate('idMedico').populate('idPaciente');
            observacionesMedicos[medico.nombre] = observaciones
        }

        resp.status(200).json({
            ok: true,
            msg: 'Lista de observaciones',
            observaciones: observacionesMedicos
        });
        
    } catch (error) {
        console.log(error);
        resp.status(400).json({
            ok: false,
            msg: 'error al listar observaciones',
        });
    }
}

const generarReporte = async (req, resp = response) => {
    try {
        const idPaciente = req.params.id;
        const paciente = await Usuario.findOne({identificacion: idPaciente});

        const observaciones = await Observacion.find({idPaciente})
                                    .populate('idPaciente')
                                    .populate('idMedico');

        if (observaciones.length > 0) {
            let idHospital = observaciones[0].idMedico.idHospital;
            let hospital = await Usuario.findById({_id: idHospital});
            const nombreHospital = hospital.nombre;

            const doc = new PDFDocument();

            // Define el nombre del archivo PDF y los encabezados HTTP necesarios para descargar el archivo
            resp.setHeader('Content-Type', 'application/pdf');
            resp.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
            
            // Escribe el contenido del archivo PDF
            doc.pipe(fs.createWriteStream('reporte.pdf'));
            
            doc.fontSize(18).text('Reporte', {
                align: 'center'
            });

            doc.fontSize(14).text(`Paciente: ${paciente.nombre}`);
            doc.fontSize(14).text("");

            observaciones.map((observacion) => {
                doc.fontSize(12).text(`Observacion: ${observacion.observacion}`);
                doc.fontSize(12).text(`Estado Salud: ${observacion.estadoSalud}`);
                doc.fontSize(12).text(`Especialidad Medica: ${observacion.especialidadMedica}`);
                doc.fontSize(12).text(`Medico: ${observacion.idMedico.nombre}`);
                doc.fontSize(12).text(`Hospital: ${nombreHospital}`);
                doc.fontSize(12).text(`---------------------------------------`);
                doc.fontSize(12).text("");
            });
            
            // Finaliza la escritura del documento y cierra el stream
            doc.end();
            // Envía el archivo PDF como respuesta al cliente
            doc.pipe(resp);
        } else {
            return resp.status(200).json({
                ok: true,
                msg: "No hay registros"
            });
        }
    } catch (error) {
        console.log(error);
        return resp.status(400).json({
            ok: false,
            msg: "Error al generar reporte",
            error: error
        });
    }
}

const crearObservacion = async (req, resp) => {
    try { 
        console.log(req.body);
        const idMedico = req.usuario._id;
        console.log(idMedico);
        let observacion = new Observacion(req.body);
        console.log(observacion);

        observacion.idMedico = idMedico
        observacion = await observacion.save();
        
        resp.status(200).json({
            ok: true,
            msg: 'Observacion creada exitosamente',
            observacion
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'error al crear Observacion',
        });
    }
}

const actualizarObservacion = async (req, resp = response) => {
    try {
        const odontologoId = req.params.id;
        const odontologo = await Odontologo.findById(odontologoId);
        if(!odontologo) {
            resp.status(201).json({
                ok: false,
                msg: 'El id del odontologo no coincide con ningun elemento en la base de datos',
            });
        }

        const odontologoActualizado = await Odontologo.findByIdAndUpdate(odontologoId, req.body, {new: true});
        resp.status(200).json({
            ok: true,
            msg: 'Odontologo actualizado exitosamente',
            odontologo: odontologoActualizado
        });
    } catch (error) {
        console.log(error);
        resp.status(400).json({
            ok: false,
            msg: 'error al actualizar odontologo',
        });
    }
}


module.exports = {
    getObservacionByMedicosHospital,
    getObservacionByIdPaciente,
    getObservacionByIdMedico,
    crearObservacion,
    generarReporte
}
