const fs = require('fs');
var datos = require('../teaching/teachingModel');
var csv = require('csvtojson');
var newUser = require('../user/userModel');

const importProfesor = async (req, res) => {
    try {
        var datosData = [];
        var userData = [];
        await csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);

                // Iterar sobre el arreglo de objetos y guardarlos en el arreglo datosData
                for (var i = 0; i < response.length; i++) {
                    userData.push({
                        email: `${response[i].nombrePrimer[0]}${response[i].nombrePrimer[1]}${response[i].apellidoP}@email.com`.toLowerCase(),
                        username: response[i].nombrePrimer,
                        password: 1234,
                        isAdmin: false,
                    });
                    datosData.push({
                        rut: response[i].rut,
                        email: `${response[i].nombrePrimer[0]}${response[i].nombrePrimer[1]}${response[i].apellidoP}@email.com`.toLowerCase(),
                        nombrePrimer: response[i].nombrePrimer,
                        nombreSegundo: response[i].nombreSegundo,
                        apellidoP: response[i].apellidoP,
                        apellidoM: response[i].apellidoM,
                    });
                }

                // Insertar los datos en la base de datos
                await datos.insertMany(datosData);
                await newUser.insertMany(userData);
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
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports = {
    importProfesor
};
