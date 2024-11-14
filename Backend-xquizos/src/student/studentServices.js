var studentModel = require('./studentModel.js');

module.exports.registerStudentDBService = (studentData) => {
    return new Promise(async function myFn(resolve, reject) {

        var studentModelData = new studentModel();

        studentModelData.matricula = studentData.matricula;
        studentModelData.rut = studentData.rut;
        studentModelData.email = studentData.email;
        studentModelData.nombrePrimer = studentData.nombrePrimer;
        studentModelData.nombreSegundo = studentData.nombreSegundo;
        studentModelData.apellidoP = studentData.apellidoP;
        studentModelData.apellidoM = studentData.apellidoM;
        studentModelData.carrera = studentData.carrera;

        try {
            await studentModelData.save();
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


module.exports.searchStudentDBService = async (studentData) => {
    try {
        const result = await studentModel.findOne({ matricula: studentData.matricula });

        if (result) {
            console.log("Usuario encontrado");
            return { status: true, msg: "Usuario encontrado", user: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.getStudentsDBService = async () => {
    try {
        const result = await studentModel.find();


        if (result.length > 0) {
            console.log("Estudiantes encontrados");
            return { status: true, msg: "Estudiantes encontrados", students: result };
        } else {
            console.log("No se encontraron estudiantes");
            return { status: false, msg: "No se encontraron estudiantes" };
        }

    } catch (error) {
        console.log("Error al obtener estudiantes:", error);
        return { status: false, msg: "Error al obtener estudiantes" };
    }
};

module.exports.editStudentDBService = async (matricula, updatedData) => {
    try {
        const student = await studentModel.findOne({ matricula });

        if (student) {
            Object.assign(student, updatedData); // Usamos Object.assign para actualizar los campos
            await student.save();

            console.log("Estudiante actualizado:", student);
            return { status: true, msg: "Estudiante actualizado correctamente", student };
        } else {
            console.log("Estudiante no encontrado");
            return { status: false, msg: "Estudiante no encontrado" };
        }
    } catch (error) {
        console.log("Error al actualizar el estudiante:", error);
        return { status: false, msg: "Error al actualizar el estudiante" };
    }
};

module.exports.removeStudentDBService = async (matricula) => {
    try {
        const student = await studentModel.findOne({ matricula });

        if (student) {
            await studentModel.deleteOne({ matricula });

            console.log("Estudiante eliminado:", student);
            return { status: true, msg: "Estudiante eliminado correctamente", student };
        } else {
            console.log("Estudiante no encontrado");
            return { status: false, msg: "Estudiante no encontrado" };
        }
    } catch (error) {
        console.log("Error al eliminar el estudiante:", error);
        return { status: false, msg: "Error al eliminar el estudiante" };
    }
};


