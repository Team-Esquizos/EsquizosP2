
const fs = require('fs');
var datos = require('../course/courseModel');
var csv = require('csvtojson');

const importCurso = async (req, res) => {
    try {
        
        var datosData = [];

        csv()
        .fromFile(req.file.path)
        .then(async (response) => {
            console.log(response);

            // Iterar sobre el arreglo de objetos y guardarlos en el arreglo datosData
            for (var i = 0; i < response.length; i++) {
                const matriculas = response[i].matricula.split(',').map(matricula => ({ matricula: matricula.trim() }));
                datosData.push({
                    
                    codigo: response[i].codigo,
                    carrera: response[i].carrera,
                    nombre: response[i].nombre,
                    semestre: response[i].semestre,
                    seccion: response[i].seccion,
                });
            }

            // Insertar los datos en la base de datos
            await datos.insertMany(datosData);
            console.log('Datos importados correctamente');
            
            // Enviar respuesta al cliente
            res.send({ status: 200, success: true, message: 'Datos importados correctamente' });

            // Eliminar el archivo después de procesarlo
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                } else {
                    console.log('Archivo CSV eliminado');
                }
            });

        });
    } catch (error) {
        res.send({ status: 400, success: false, message: error.message });
    }

    
};

const getCurso = async (req, res) => {
    try {
        // Obtener los datos de la base de datos
        var datosData = await datos.find();
        console.log(datosData);
        res.send({ status: 200, success: true, data: datosData });
    } catch (error) {
        res.send({ status: 400, success: false, message: error.message });
    }
};


module.exports = {
    importCurso,
    getCurso

}