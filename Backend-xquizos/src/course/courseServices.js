var courseModel = require('./courseModel.js');
var teachingModel = require('../teaching/teachingModel.js');

module.exports.registerCourseDBService = (courseData) => {
    return new Promise(async function myFn(resolve, reject) {

        var courseModelData = new courseModel();

        courseModelData.nombre = courseData.nombre.toUpperCase();
        courseModelData.seccion = courseData.seccion.toUpperCase();
        courseModelData.area = courseData.area.toUpperCase();
        courseModelData.docente = courseData.docente;
        courseModelData.alumnos = courseData.alumnos;

        try {
            await courseModelData.save();
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


module.exports.searchCourseDBService = async (courseData) => {
    try {
        const result = await courseModel.findOne({ nombre: courseData.nombre, seccion: courseData.seccion });

        if (result) {
            console.log("Curso encontrado");
            return { status: true, msg: "Curso encontrado", user: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.getCoursesDBService = async () => {
    try {
        const result = await courseModel.find();


        if (result.length > 0) {
            console.log("Cursos encontrados");
            return { status: true, msg: "Cursos encontrados", courses: result };
        } else {
            console.log("No se encontraron Cursos");
            return { status: false, msg: "No se encontraron Cursos" };
        }

    } catch (error) {
        console.log("Error al obtener Cursos:", error);
        return { status: false, msg: "Error al obtener Cursos" };
    }
};

module.exports.editCourseDBService = async (nombre, seccion, updatedData) => {
    try {
        console.log(nombre);  // Verifica el valor de nombre aquí
        const course = await courseModel.findOne({ nombre, seccion });

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


module.exports.removeCourseDBService = async (nombre, seccion) => {
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

module.exports.getCoursesByEmailDBService = async (email) => {

   
    
    try {
        const teacher = await teachingModel.findOne({ email });
        if (!teacher) {
            console.log("Profesor no encontrado");
            return { status: false, msg: "Profesor no encontrado" };
        }
    
        console.log("Profesor encontrado:", teacher);
    
       
    

        // Acceder al atributo 'rut' del profesor
         const teacherRut = teacher.rut;
         console.log(teacherRut);

// Buscar cursos asociados al profesor
        const result = await courseModel.find({ rut: teacherRut });

        if (result.length > 0) {
            console.log("Cursos encontrados");
            return { status: true, msg: "Cursos encontrados", courses: result };
        } else {
            console.log("No se encontraron Cursos");
            return { status: false, msg: "No se encontraron Cursos" };
        }

    } catch (error) {
        console.log("Error al obtener Cursos:", error);
        return { status: false, msg: "Error al obtener Cursos" };
    }
};
