const mongoose = require('../db');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  edad: Number,
  email: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;