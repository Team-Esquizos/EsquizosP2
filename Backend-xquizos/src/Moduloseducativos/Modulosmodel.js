var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modulosSchema = new Schema({
        Aprendizaje: { type: String, required: false },
        TipoSaber: { type: String, required: false }
    
});


module.exports = mongoose.model('Modulos', modulosSchema, 'Modulos');