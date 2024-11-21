var courseInstanceModel = require('./courseInstanceModel.js');
var teachingModel = require('../teaching/teachingModel.js');

module.exports.registerCourseInstanceDBService = (courseData) => {
    return new Promise(async function myFn(resolve, reject) {

        var courseInstanceModelData = new courseInstanceModel();

        courseInstanceModelData.codCurso = courseData.codigo.toUpperCase();
        courseInstanceModelData.codDocente = "XD";

        try {
            await courseInstanceModelData.save();
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


module.exports.getCourseInstanceDBService = async (curso) => {
    try {
        console.log(curso.codCurso);
        const result = await courseInstanceModel.findOne({ codCurso: curso.codCurso });
        console.log(result);
        if (result) {
            console.log("Curso encontrado");
            return { status: true, msg: "Curso encontrado", courseInstance: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.getStudentsFromCourseInstanceDBService = async (curso) => {
    try {
        console.log("Código del curso:", curso);

        // Obtener la instancia del curso
        const result = await this.getCourseInstanceDBService(curso);
        if (!result) {
            console.log("No se encontró la instancia del curso.");
            return { status: false, msg: "Curso no encontrado" };
        }

        console.log("Instancia del curso encontrada:", result.courseInstance);

        // Verificar si el arreglo de alumnos existe y tiene elementos
        if (!result.courseInstance.alumnos || result.courseInstance.alumnos.length === 0) {
            console.log("No hay alumnos registrados en el curso.");
            return { status: false, msg: "No hay alumnos registrados en el curso" };
        }

        // Extraer las matrículas de los alumnos
        const matriculas = result.courseInstance.alumnos.map((alumno) => alumno.matricula);
        console.log("Matrículas de alumnos:", matriculas);

        // Buscar los estudiantes en la base de datos usando sus matrículas
        const students = await studentModel.find({ matricula: { $in: matriculas } });
        console.log("Datos de los estudiantes encontrados:", students);

        if (students.length > 0) {
            return { status: true, msg: "Estudiantes encontrados", students: students };
        } else {
            console.log("No se encontraron estudiantes con las matrículas proporcionadas.");
            return { status: false, msg: "No se encontraron estudiantes con las matrículas proporcionadas" };
        }
    } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        return { status: false, msg: "Error al obtener los estudiantes", error: error.message };
    }
};


module.exports.getTeachingFromCourseInstanceDBService = async (curso) => {
    try {
        console.log(curso);
        const result = await this.getCourseInstanceDBService(curso);
        
        console.log("Instancia de curso: ",result.courseInstance);
        console.log("Codigo del docente: ",result.courseInstance.codDocente);
        const teaching = await teachingModel.findOne({ rut: result.courseInstance.codDocente });
        console.log(teaching);
        if (teaching) {
            console.log("Profesor encontrado");
            return { status: true, msg: "Profesor encontrado", teaching: teaching  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};


module.exports.editCourseInstanceDBService = async (codigo, updatedData) => {
    try {
        const course = await courseModel.findOne({ codigo });

        if (course) {
            Object.assign(course, updatedData);
            await course.save();

            console.log("Curso actualizado:", course);
            return { status: true, msg: "Curso actualizado correctamente", course };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al actualizar el Curso:", error);
        return { status: false, msg: "Error al actualizar el Curso" };
    }
};


module.exports.removeCourseInstanceDBService = async (nombre, seccion) => {
    try {
        const course = await courseModel.findOne({ nombre, seccion });

        if (course) {
            await courseModel.deleteOne({ nombre, seccion });

            console.log("Curso eliminado:", course);
            return { status: true, msg: "Curso eliminado correctamente", course };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al eliminar el Curso:", error);
        return { status: false, msg: "Error al eliminar el Curso" };
    }
};



