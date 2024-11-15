var teachingModel = require('./teachingModel.js');
var userModel = require('../user/userModel.js');


module.exports.registerTeachingDBService = (teachingData) => {
    return new Promise(async function myFn(resolve, reject) {

        var teachingModelData = new teachingModel();
        const newUser = new userModel();

        newUser.email = `${teachingData.nombrePrimer[0]}${teachingData.nombrePrimer[1]}${teachingData.apellidoP}@email.com`.toLowerCase();

        teachingModelData.rut = teachingData.rut;
        teachingModelData.email = newUser.email;
        teachingModelData.nombrePrimer = teachingData.nombrePrimer;
        teachingModelData.nombreSegundo = teachingData.nombreSegundo;
        teachingModelData.apellidoP = teachingData.apellidoP;
        teachingModelData.apellidoM = teachingData.apellidoM;
        teachingModelData.cursos = teachingData.cursos;

        newUser.password = "1234";  
        newUser.isAdmin = false; 
        newUser.username = `${teachingData.nombrePrimer}${teachingData.apellidoP}`.toLowerCase();
        try {
            await teachingModelData.save();
            await newUser.save();
            console.log("New user created:", newUser);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};




module.exports.searchTeachingDBService = async (teachingData) => {
    try {
        const result = await teachingModel.findOne({ matricula: teachingData.matricula });

        if (result) {
            console.log("Docente encontrado");
            return { status: true, msg: "Docente encontrado", user: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.getTeachingsDBService = async () => {
    try {
        const result = await teachingModel.find();


        if (result.length > 0) {
            console.log("Docentes encontrados");
            return { status: true, msg: "Docentes encontrados", teachings: result };
        } else {
            console.log("No se encontraron Docentes");
            return { status: false, msg: "No se encontraron Docentes" };
        }

    } catch (error) {
        console.log("Error al obtener Docentes:", error);
        return { status: false, msg: "Error al obtener Docentes" };
    }
};

module.exports.editTeachingDBService = async (rut, updatedData) => {
    try {
        const teaching = await teachingModel.findOne({ rut });

        if (teaching) {
            Object.assign(teaching, updatedData); // Usamos Object.assign para actualizar los campos
            await teaching.save();

            console.log("Docente actualizado:", teaching);
            return { status: true, msg: "Docente actualizado correctamente", teaching };
        } else {
            console.log("Docente no encontrado");
            return { status: false, msg: "Docente no encontrado" };
        }
    } catch (error) {
        console.log("Error al actualizar el Docente:", error);
        return { status: false, msg: "Error al actualizar el Docente" };
    }
};

module.exports.removeTeachingDBService = async (rut) => {
    try {
        const teaching = await teachingModel.findOne({ rut });

        if (teaching) {
            await teachingModel.deleteOne({ rut });

            console.log("Docente eliminado:", teaching);
            return { status: true, msg: "Docente eliminado correctamente", teaching };
        } else {
            console.log("Docente no encontrado");
            return { status: false, msg: "Docente no encontrado" };
        }
    } catch (error) {
        console.log("Error al eliminar el Docente:", error);
        return { status: false, msg: "Error al eliminar el Docente" };
    }
};