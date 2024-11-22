var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema ({
    codigo: {type: String, required: true, unique: true},
    carrera: {type: String, required: true, unique: false},
    nombre: {type: String, required: true},
    semestre: {type: String, required: true, unique: false},
    seccion: {
        type: String,
        required: true,
        match: /^[A-Z]$/ // Solo letras mayúsculas de la A a la Z
    }

})

courseSchema.index({ nombre: 1, seccion: 1 }, { unique: true });


module.exports = mongoose.model('Course', courseSchema, 'Course');