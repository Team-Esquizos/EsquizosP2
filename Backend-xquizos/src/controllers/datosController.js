var datos=require('../models/datos');
var csv = require('csvtojson');


const importDatos = async (req,res) => {
    

    try {
        var datosData = [];

        csv()
        .fromFile(req.file.path)
        .then(async(response)=>{
            console.log(response);
               
                // Iterar sobre el arreglo de objetos y guardarlos en el arreglo datosData
                for(var i=0; i < response.length; i++){
                    datosData.push({
                        nombre: response[i].nombre,
                        apellido: response[i].apellido,
                        
                        pais: response[i].pais,
                        ciudad: response[i].ciudad,
                        fecha_nacimiento: response[i].fecha_nacimiento,
                        estatura: response[i].estatura
                    });
                }
                // Insertar los datos en la base de datos
                await datos.insertMany(datosData);
                console.log('Datos importados correctamente');
        })
        // Enviar respuesta al cliente
        res.send({status:200,success:true,message:'Datos importados correctamente'});

    }
    catch (error) {
       res.send({status:400,success:false,message:error.message});
    }
}


module.exports = {
    importDatos
}