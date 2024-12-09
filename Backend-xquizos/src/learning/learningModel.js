var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var learningSchema = new Schema ({
    aprendizaje: {type: String, required: true, unique: true},
    tipoSaber: {type: String, required: false, unique: false}

})



module.exports = mongoose.model('Learning', learningSchema, 'Learning');