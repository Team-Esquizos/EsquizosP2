var datos = require('../student/studentModel');
var csv = require('csvtojson');

const importEstudiante = async (req, res) => {
    try {
        var datosData = [];

        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);

                // Iterar sobre el arreglo de objetos y guardarlos en el arreglo datosData
                for (var i = 0; i < response.length; i++) {
                    // Asumimos que los cursos están en la propiedad 'curso' y que son una lista separada por comas
                    const cursos = response[i].curso ? response[i].curso.split(',') : [];

                    datosData.push({
                       
                        nombres: response[i].nombres,
                        rut: response[i].rut,
                        apellidoP: response[i].apellidoP,
                        apellidoM: response[i].apellidoM,
                        matricula: response[i].matricula,
                        fecNac: response[i].fecNac,
                        fecIng: response[i].fecIng // Guardamos los cursos como un array
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
}

module.exports = {
    importEstudiante
}
