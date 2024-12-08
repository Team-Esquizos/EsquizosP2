var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseLearningSchema = new Schema ({
    codCurso: {type: String, required: true, unique: false},
    aprendizaje: {type: String, required: true, unique: false}
})

courseLearningSchema.index({ codCurso: 1, aprendizaje: 1 }, { unique: true });

module.exports = mongoose.model('CourseLearning', courseLearningSchema, 'CourseLearning');