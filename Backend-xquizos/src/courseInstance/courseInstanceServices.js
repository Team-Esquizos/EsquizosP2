var courseInstanceModel = require('./courseInstanceModel.js');
var teachingModel = require('../teaching/teachingModel.js');
var courseModel = require('../course/courseModel.js');
var studentModel = require('../student/studentModel.js');

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

        const result = await this.getCourseInstanceDBService(curso);
        if (!result) {
            console.log("No se encontró la instancia del curso.");
            return { status: false, msg: "Curso no encontrado" };
        }

        console.log("Instancia del curso encontrada:", result.courseInstance);

        if (!result.courseInstance.alumnos || result.courseInstance.alumnos.length === 0) {
            console.log("No hay alumnos registrados en el curso.");
            return { status: false, msg: "No hay alumnos registrados en el curso" };
        }

        const matriculas = result.courseInstance.alumnos.map((alumno) => alumno.matricula);
        console.log("Matrículas de alumnos:", matriculas);

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



module.exports.updateCodDocenteInCourseInstance = async (curso, newCodDocente) => {
    try {
        // Busca la instancia del curso por su código
        console.log(curso);
        console.log(newCodDocente);
        const result = await this.getCourseInstanceDBService(curso);
        console.log(result.courseInstance);

        if (result) {
            result.courseInstance.codDocente = newCodDocente.codDocente; 
            await result.courseInstance.save();

            console.log("codDocente actualizado:", result.courseInstance.codDocente);
            return { status: true, msg: "codDocente actualizado correctamente", codDocente : result.courseInstance.codDocente };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al actualizar codDocente:", error);
        return { status: false, msg: "Error al actualizar codDocente" };
    }
};

module.exports.addStudentToCourseInstanceDBService = async (curso, alumno) => {
    try {
        // Busca la instancia del curso por su código
        console.log("Curso:", curso);
        const newAlumno = alumno.alumno;
        console.log("Nuevo alumno:", newAlumno);

        const result = await this.getCourseInstanceDBService(curso);

        if (result && result.courseInstance) {
            const courseInstance = result.courseInstance;

            // Verifica si ya existe un alumno con la misma matrícula
            const isAlumnoExist = courseInstance.alumnos.some(
                (a) => a.matricula === newAlumno
            );

            if (isAlumnoExist) {
                return {
                    status: false,
                    msg: "El alumno ya está matriculado en el curso",
                };
            }

            // Agrega el nuevo alumno al arreglo, asegurándose de pasar un objeto con los campos correctos
            courseInstance.alumnos.push({
                matricula: newAlumno,
            });

            await courseInstance.save();

            console.log("Alumno agregado:", newAlumno);
            return {
                status: true,
                msg: "Alumno agregado correctamente",
                alumnos: courseInstance.alumnos,
            };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al agregar alumno:", error);
        return { status: false, msg: "Error al agregar alumno" };
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


module.exports.getTeacherCourseInstanceDBService = async (rut) => {
    try {
        console.log(rut.rut);

        // Encuentra las instancias de cursos asociadas al profesor
        const courseInstances = await courseInstanceModel.find({ codDocente: rut });
        console.log(courseInstances);

        if (courseInstances && courseInstances.length > 0) {
            // Extrae los codCurso únicos de las instancias
            const courseCodes = courseInstances.map(instance => instance.codCurso);
            console.log("Course Codes:", courseCodes);

            // Busca los detalles de los cursos con los codCurso
            const courses = await courseModel.find({ codigo: { $in: courseCodes } });
            console.log("Courses:", courses);

            // Retorna solo los cursos encontrados
            return { status: true, msg: "Cursos encontrados", courses };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.error("Error:", error);
        return { status: false, msg: "INVALID DATA" };
    }
};



