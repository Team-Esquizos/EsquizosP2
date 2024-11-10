var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DatosSchema  = new Schema({
    nombre: String,
    apellido: String,
    pais: String,
    ciudad: String,
    fecha_nacimiento:String,
    estatura: String,
});

module.exports = new mongoose.model('datos', DatosSchema);