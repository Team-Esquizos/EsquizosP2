var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseInstanceSchema = new Schema ({
    codCurso: {type: String, required: true, unique: false},
    codDocente: {type: String, required: false, unique: false},
    periodo: {type: String, required: false, unique: false},
    alumnos: [
        {
        matricula: {type: String, required: false}
        }
    ]

})

courseInstanceSchema.index({ codCurso: 1, periodo: 1 }, { unique: true });


courseInstanceSchema.pre('save', function (next) {
    const matriculas = this.alumnos.map(alumno => alumno.matricula);
    const matriculasUnicas = new Set(matriculas);
  
    if (matriculas.length !== matriculasUnicas.size) {
      return next(new Error('Las matrículas en el arreglo "alumnos" deben ser únicas.'));
    }
    next();
  });



module.exports = mongoose.model('CourseInstance', courseInstanceSchema, 'CourseInstance');