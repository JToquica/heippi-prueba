const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    identificacion: { 
        type: String,
        unique: true,
        required: true 
    },
    nombre: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    clave: { 
        type: String,
        required: true 
    },
    telefono: { 
        type: String,
        required: true 
    },
    tipoUsuario: { 
        type: String,
        required: true,
        enum: ['Hospital', 'Paciente', 'Medico'] 
    },
    direccion: { 
        type: String, 
        required: true 
    },
    serviciosMedicos: { 
        type: [String], 
        required: function() {
            return this.tipoUsuario === 'Hospital';
        },
    },
    fechaNacimiento: {
        type: String, 
        required: function() {
            return this.tipoUsuario === 'Paciente' || this.tipoUsuario === 'Medico';
        },
    },
    verificado: {
        type: Boolean,
        default: false
    },
    cambioPassword: {
        type: Boolean,
        default: function() {
            return this.tipoUsuario === 'Medico';
        },
    },
    idHospital: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return this.tipoUsuario === 'Medico';
        },
    },
    token: {
        type: String,
    },
});

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, ...usuario  } = this.toObject();
    return usuario;
}

module.exports = model('User', UsuarioSchema);