var mongoose = require('mongoose');
const { truncateSync } = require('node:fs');
var Schema = mongoose.Schema;

var courseInstanceSchema = new Schema ({
    codCurso: {type: String, required: true, unique: true},
    codDocente: {type: String, required: false, unique: false},
    alumnos: [
        {
        matricula: {type: String, required: false}
        }
    ]

})

// Validamos que la matricula no se repita dentro del arreglo alumnos
courseInstanceSchema.pre('save', function (next) {
    const matriculas = this.alumnos.map(alumno => alumno.matricula);
    const matriculasUnicas = new Set(matriculas);
  
    if (matriculas.length !== matriculasUnicas.size) {
      return next(new Error('Las matrículas en el arreglo "alumnos" deben ser únicas.'));
    }
    next();
  });



module.exports = mongoose.model('CourseInstance', courseInstanceSchema, 'CourseInstance');