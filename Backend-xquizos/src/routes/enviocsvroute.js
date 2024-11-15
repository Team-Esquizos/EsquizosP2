const express = require('express');
const datos = express();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const uploadDir = path.resolve(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

datos.use(bodyParser.urlencoded({ extended: true }));
datos.use(express.static(path.resolve(__dirname, 'uploads')));

// Almacenamiento configurado para multer.
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, 'uploads')); // Usa path.resolve para definir la ruta completa
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

const cursoController = require('../controllers/cursoController');
const profesorController = require('../controllers/ProfesorController');
const estudianteController = require('../controllers/EstudianteController');

// Rutas de carga de archivos
datos.post('/importCurso', upload.single('file'), cursoController.importCurso);
datos.post('/importProfesor', upload.single('file'), profesorController.importProfesor);
datos.post('/importEstudiante', upload.single('file'), estudianteController.importEstudiante);

datos.get('/getCurso', cursoController.getCurso);

module.exports = datos;
