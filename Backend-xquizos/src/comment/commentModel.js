var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema ({

    matricula: {type: String, required: true, unique: false},
    codDocente: {type: String, required: true, unique: false},
    comentario: {type: String, required: true, unique: false},
    peso: {type: Number, required: true, unique: false}

})

module.exports = mongoose.model('Comment', commentSchema, 'Comment');