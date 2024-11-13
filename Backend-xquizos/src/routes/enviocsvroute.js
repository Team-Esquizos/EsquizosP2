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
const cursoController = require('../controllers/cursoController');
const profesorController = require('../controllers/ProfesorController');

datos.post('/importDatos',upload.single('file'),datosController.importDatos);
datos.post('/importCurso',upload.single('file'),cursoController.importCurso);
datos.post('/importProfesor',upload.single('file'),profesorController.importProfesor);
datos.get('/getCurso',cursoController.getCurso);
module.exports = datos;