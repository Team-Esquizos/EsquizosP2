var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema ({
    matricula: {type: String, required: true, unique: true},
    rut: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    nombrePrimer: {type: String, required: true, unique: false},
    nombreSegundo: {type: String, required: true, unique: false},
    apellidoP: {type: String, required: true, unique: false},
    apellidoM: {type: String, required: true, unique: false},
    carrera: {type: String, required: true, unique: false},
    cursos: [
        {
            nombre: { type: String, required: true }
        }
    ]
})

module.exports = mongoose.model('Student', studentSchema, 'Student');