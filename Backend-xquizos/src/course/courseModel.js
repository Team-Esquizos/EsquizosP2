var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema ({
    nombre: {type: String, required: true},
    seccion: {
        type: String,
        required: true,
        match: /^[A-Z]$/ // Solo letras mayúsculas de la A a la Z
    },
    area: {type: String, required: true, unique: false},
    docente: {type: String, required: false, unique: false},
    rut: {type: String},
    alumnos: [
        {
            matricula: { type: String, required: false }
        },
    ]

})

courseSchema.index({ nombre: 1, seccion: 1 }, { unique: true });


  
// Validación de que no se repita un alumno dentro del mismo curso
courseSchema.path('alumnos').validate(function (alumnos) {
    const matriculaCount = {}; 
    for (const alumno of alumnos) {
      const matricula = alumno.matricula;
      if (matriculaCount[matricula]) {
        return false; 
      }
      matriculaCount[matricula] = 1; 
    }
    return true; 
}, 'La matrícula debe ser única dentro del arreglo de alumnos.');



module.exports = mongoose.model('Course', courseSchema, 'Course');