var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teachingSchema = new Schema ({

    rut: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    nombrePrimer: {type: String, required: true, unique: false},
    nombreSegundo: {type: String, required: true, unique: false},
    apellidoP: {type: String, required: true, unique: false},
    apellidoM: {type: String, required: true, unique: false}
})

module.exports = mongoose.model('Teaching', teachingSchema, 'Teaching');