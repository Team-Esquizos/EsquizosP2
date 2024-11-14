var datos = require('../models/curso');
var csv = require('csvtojson');

const importCurso = async (req, res) => {
    try {
        console.log('adrian chupalo');
        var datosData = [];

        csv()
        .fromFile(req.file.path)
        .then(async (response) => {
            console.log(response);

            // Iterar sobre el arreglo de objetos y guardarlos en el arreglo datosData
            for (var i = 0; i < response.length; i++) {
                datosData.push({
                    ID: response[i].ID,
                    curso: response[i].curso,
                    nombreAlumno: response[i].nombreAlumno,
                    apellidoAlumno: response[i].apellidoAlumno
                });
            }

            // Insertar los datos en la base de datos
            await datos.insertMany(datosData);
            console.log('Datos importados correctamente');
            
            // Enviar respuesta al cliente
            res.send({ status: 200, success: true, message: 'Datos importados correctamente' });
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