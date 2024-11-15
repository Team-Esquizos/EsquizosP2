
var datos=require('../teaching/teachingModel');
var csv = require('csvtojson');


const importProfesor = async (req,res) => {
    try {
        var datosData = [];

        csv()
        .fromFile(req.file.path)
        .then(async(response)=>{
            console.log(response);

                // Iterar sobre el arreglo de objetos y guardarlos en el arreglo datosData
                for(var i=0; i < response.length; i++){
                    datosData.push({
                        rut: response[i].rut,
                        email: response[i].email,
                        nombrePrimer: response[i].nombrePrimer,
                        nombreSegundo: response[i].nombreSegundo ,
                        apellidoP: response[i].apellidoP ,
                        apellidoM: response[i].apellidoM,
                    });
                }
                // Insertar los datos en la base de datos
                await datos.insertMany(datosData);
                console.log('Datos importados correctamente');
        })
        // Enviar respuesta al cliente
        res.send({status:200,success:true,message:'Datos importados correctamente'});
        // Eliminar el archivo después de procesarlo
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            } else {
                console.log('Archivo CSV eliminado');
            }
        });

    }
    catch (error) {
       res.send({status:400,success:false,message:error.message});
    }
}

module.exports = {
    importProfesor
}