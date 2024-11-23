var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema ({
    nombres: {type: String, required: true, unique: false},
    apellidoP: {type: String, required: true, unique: false},
    apellidoM: {type: String, required: true, unique: false},
    rut: {type: String, required: true, unique: true},
    matricula: {type: String, required: true, unique: true},
    fecNac: {type: String, required: true, unique: false},
    fecIng: {type: String, required: true, unique: false}

})

module.exports = mongoose.model('Student', studentSchema, 'Student');