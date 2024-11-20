var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teachingSchema = new Schema ({

    nombres: {type: String, required: true, unique: false},
    apellidoP: {type: String, required: true, unique: false},
    apellidoM: {type: String, required: true, unique: false},
    rut: {type: String, required: true, unique: true},
    titulo: {type: String, required: true, unique: false},
    gradoMax: {type: String, required: true, unique: false},

})

module.exports = mongoose.model('Teaching', teachingSchema, 'Teaching');