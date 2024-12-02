var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({

    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    isAdmin: {type: Boolean, required: true},
    rut: {type: String, required: true, unique: true},
    imagen:{ type: String, required: false}

})

module.exports = mongoose.model('User', userSchema, 'User');