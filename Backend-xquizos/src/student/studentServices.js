var studentModel = require('./studentModel.js');
var courseModel = require('../course/courseModel.js');


module.exports.registerStudentDBService = (studentData) => {
    return new Promise(async function myFn(resolve, reject) {

        var studentModelData = new studentModel();

        studentModelData.nombres = studentData.nombres;
        studentModelData.apellidoP = studentData.apellidoP;
        studentModelData.apellidoM = studentData.apellidoM;
        studentModelData.rut = studentData.rut;
        studentModelData.matricula = studentData.matricula;
        studentModelData.fecNac = studentData.fecNac;
        studentModelData.fecIng = studentData.fecIng;

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

module.exports.addlista_de_accionesDBService = async (matricula, accion) => {
    try {
        const student = await studentModel.findOneAndUpdate(
            { matricula },
            { $push: { lista_de_acciones: accion } }, // Agrega la acción
            { new: true } // Devuelve el documento actualizado
        );

        if (student) {
            console.log("Lista de acciones agregadas al estudiante:", student);
            return { status: true, msg: "Estudiante actualizado correctamente", student };
        } else {
            console.log("Estudiante no encontrado");
            return { status: false, msg: "Estudiante no encontrado" };
        }
    } catch (error) {
        console.error("Error al actualizar el estudiante:", error);
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

/*module.exports.getCourseByIdDBService = async (_id) => {
    try {
        // Buscar el curso por su ID
        const course = await courseModel.findOne({ _id });
        if (!course) {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }

        console.log("Curso encontrado:", course);

        // Filtrar a los alumnos del curso según la matrícula
        
    } catch (error) {
        console.log("Error al obtener el curso y los alumnos:", error);
        return { status: false, msg: "Error al obtener el curso y los alumnos" };
    }
};*/

/*module.exports.getCourseByNomDBService = async (nombre, seccion) => {
    try {
        console.log(nombre);  // Verifica el valor de nombre aquí
        const course = await courseModel.findOne({ nombre, seccion });
        console.log(course)

        if (course) {
            const students = course.alumnos.filter((alumno) => alumno.matricula === course.students.matricula);
            if (students.length === 0) {
                console.log("No se encontraron alumnos con la matrícula especificada");
                return { status: false, msg: "No se encontraron alumnos con esa matrícula" };
            }

            console.log("Alumnos encontrados:", students);
            return { status: true, msg: "Alumnos encontrados", students };
        } else {
            console.log("Alumnos no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al actualizar el Curso:", error);
        return { status: false, msg: "Error al actualizar el Curso" };
    }
};*/

module.exports.getCourseByNomDBService = async (nombre, seccion) => {
    try {
        console.log(nombre);  // Verifica el valor de nombre aquí
        const course = await courseModel.findOne({ nombre, seccion });
        console.log(course);

        if (course) {
            // Extraer todas las matrículas de los alumnos
            const matriculas = course.alumnos.map(alumno => alumno.matricula);
            console.log("Matrículas del curso:", matriculas);

            // Buscar alumnos que tengan una matrícula dentro de las matrículas del curso
            const students = await studentModel.find({ matricula: { $in: matriculas } });

            if (students.length === 0) {
                console.log("No se encontraron alumnos con las matrículas especificadas");
                return { status: false, msg: "No se encontraron alumnos con esas matrículas" };
            }

            console.log("Alumnos encontrados:", students);
            return { status: true, msg: "Alumnos encontrados", students };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al obtener el curso:", error);
        return { status: false, msg: "Error al obtener el curso" };
    }
};