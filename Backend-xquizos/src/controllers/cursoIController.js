const fs = require('fs');
var datos = require('../courseInstance/courseInstanceModel');
var csv = require('csvtojson');


var insertCsvcourseInstanceControllerFn = async (req, res) => {
    try {
        
        var datosData = [];

        csv()
        .fromFile(req.file.path)
        .then(async (response) => {
            for (var i = 0; i < response.length; i++) {
                const matriculas = response[i].matricula.split(',').map(matricula => ({ matricula: matricula.trim() }));
                datosData.push({
                    codCurso: response[i].codCurso,
                    codDocente: response[i].codDocente,
                    alumnos: matriculas
                });
            }
            await datos.insertMany(datosData);
            console.log('Datos importados correctamente');

            res.send({ status: 200, success: true, message: 'Datos de los alumnos importados correctamente' });
        });
    }catch (error) {
        res.send({ status: 400, success: false, message: error.message });
    }
}

module.exports = {
    insertCsvcourseInstanceControllerFn
}