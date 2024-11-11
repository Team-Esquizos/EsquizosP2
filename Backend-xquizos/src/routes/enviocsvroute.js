const express = require('express');
const datos = express();

const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');


datos.use(bodyParser.urlencoded({ extended: true }));
datos.use(express.static(path.resolve(__dirname, 'public')));

/**
 * Almacenamiento configurado para multer. Define el directorio de destino 
 * para las cargas y establece el nombre de archivo original para los archivos subidos.
 */
var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb) =>{
        cb(null,file.originalname);
    }
});

var upload = multer({storage:storage});

const datosController = require('../controllers/datosController');

datos.post('/importDatos',upload.single('file'),datosController.importDatos);
module.exports = datos;