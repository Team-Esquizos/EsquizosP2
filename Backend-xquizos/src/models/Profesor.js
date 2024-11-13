var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProfesorSchema = new Schema({
    rut: {unique: true, type: String},
    nombre: String,
    email: String,
    cursos: String,
});

module.exports = new mongoose.model('Profesor', ProfesorSchema);