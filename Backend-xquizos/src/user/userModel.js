var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({

    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},

})

module.exports = mongoose.model('User', userSchema, 'User');