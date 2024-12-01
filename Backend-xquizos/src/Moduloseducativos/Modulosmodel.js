var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modulosSchema = new Schema({
    Modulo: {type: String, required: true},
    semestre: {type: String, required: false}, // Cambiado a no requerido
    Competencia: {type: String, required: false},
    Aprendizajes: [
        {
            Aprendizaje: { type: String, required: false },
            TipoSaber: { type: String, required: false }
        }
    ]
});


module.exports = mongoose.model('Modulos', modulosSchema, 'Modulos');