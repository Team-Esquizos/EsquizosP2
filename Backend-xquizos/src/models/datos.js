//Ejemplo de funcionamiento para enviar csv a la base de datos, debemos tener 


var mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Esquema de datos para almacenar información personal.
 * @typedef {Object} Datos
 * @property {String} nombre - Nombre de la persona.
 * @property {String} apellido - Apellido de la persona.
 * @property {String} pais - País de residencia.
 * @property {String} ciudad - Ciudad de residencia.
 * @property {String} fecha_nacimiento - Fecha de nacimiento.
 * @property {String} estatura - Estatura de la persona.
 */
const DatosSchema  = new Schema({
    nombre: {
        type: String,
        unique: true
    },
    apellido: String,
    pais: String,
    ciudad: String,
    fecha_nacimiento:String,
    estatura: String,
});

module.exports = new mongoose.model('Student', DatosSchema);