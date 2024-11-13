
var datos=require('../models/Profesor');
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
                    let cursos = JSON.parse(response[i].cursos);
                    datosData.push({
                        rut: response[i].rut,
                        nombre: response[i].nombre,
                        email: response[i].email,
                        cursos: cursos 
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
    importProfesor
}