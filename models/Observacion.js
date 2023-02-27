const { Schema, model } = require('mongoose');

const ObservacionSchema = Schema({
    observacion: { 
        type: String, 
        required: true 
    },
    estadoSalud: { 
        type: String, 
        required: true,
    },
    especialidadMedica: { 
        type: String, 
        required: true,
    },
    idMedico: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    idPaciente: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = model('Observacion', ObservacionSchema);