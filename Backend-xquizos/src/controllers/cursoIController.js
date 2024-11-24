const fs = require('fs');
var datos = require('../courseInstance/courseInstanceModel');
var csv = require('csvtojson');


const insertCsvcourseInstanceControllerFn = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No se recibió ningún archivo');
        }

        let updates = [];

        await csv()
            .fromFile(req.file.path)
            .then((response) => {
                for (let i = 0; i < response.length; i++) {
                    const codCurso = response[i].codCurso?.trim();
                    const matriculas = response[i].matricula
                        .split(',')
                        .map((matricula) => ({ matricula: matricula.trim() })); // Convierte a objetos

                    if (!codCurso || matriculas.length === 0) {
                        console.error(`Datos inválidos en la fila ${i + 1}:`, response[i]);
                        continue;
                    }

                    updates.push(
                        datos.updateOne(
                            { codCurso: codCurso },
                            { $push: { alumnos: { $each: matriculas } } } // Usa $each para insertar múltiples
                        )
                    );
                }
            });

        await Promise.all(updates);

        res.send({
            status: 200,
            success: true,
            message: 'Matrículas de los alumnos asociadas a sus cursos correctamente',
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).send({
            status: 500,
            success: false,
            message: 'Error en el servidor: ' + error.message,
        });
    }
};




module.exports = {
    insertCsvcourseInstanceControllerFn
}