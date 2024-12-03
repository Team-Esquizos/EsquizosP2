var courseInstanceService = require('./courseInstanceServices.js');
var datos = require('./courseInstanceModel.js');
var csv = require('csvtojson');

var registerCourseInstanceControllerFn = async (req, res) => {
    try {
        var status = await courseInstanceService.registerCourseInstanceDBService(req.body);
        //console.log(status);

        if(status){
            res.send({"status": true, "message": "Course Instance registered succesfully"});
        } else {
            res.send({"status": false, "message": "Failed course instance registration"});
        }

    } catch (err) {
        console.log(err);
    }
}




var removeCourseInstanceControllerFn = async (req, res) => {
    const codCurso = req.params.codCurso; 

    try {
        const result = await courseInstanceService.removeCourseInstanceDBService(codCurso);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error al eliminar el curso:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}





var getCourseInstanceControllerFn = async (req, res) => {
    try {

        const codCurso = req.params.codCurso;
        console.log(codCurso);
        
        var result = await courseInstanceService.getCourseInstanceDBService( {codCurso: codCurso} );

        if(result.status){
            res.json(result);
            console.log("Curso encontrado");
        } else {
            res.status(404).send('Curso no encontrado');
            console.log("Curso no encontrado");
        }

    } catch (err) {
        res.status(500).send({ "status": false, "message": "Error en el servidor" });
        console.log(err);
    }
}

var getAllCoursesInstanceControllerFn = async (req, res) => {
    try {
        
        var result = await courseInstanceService.getAllCoursesInstanceDBService();

        if(result.status){
            res.json(result);
            console.log("Curso encontrado");
        } else {
            res.status(404).send('Curso no encontrado');
            console.log("Curso no encontrado");
        }

    } catch (err) {
        res.status(500).send({ "status": false, "message": "Error en el servidor" });
        console.log(err);
    }
}

var getStudentsFromCourseInstanceControllerFn = async (req, res) => {
    try {

        const codCurso = req.params.codCurso;
        console.log(codCurso);
        
        var result = await courseInstanceService.getStudentsFromCourseInstanceDBService( {codCurso: codCurso} );

        if(result.status){
            res.json(result);
            console.log("Curso encontrado");
        } else {
            res.status(404).send('Curso no encontrado');
            console.log("Curso no encontrado");
        }

    } catch (err) {
        res.status(500).send({ "status": false, "message": "Error en el servidor" });
        console.log(err);
    }
}

var getTeachingFromCourseInstanceControllerFn = async (req, res) => {
    try {

        const codCurso = req.params.codCurso;
        console.log(codCurso);
        
        var result = await courseInstanceService.getTeachingFromCourseInstanceDBService( {codCurso: codCurso} );

        if(result.status){
            res.json(result);
            console.log("Curso encontrado");
        } else {
            res.status(404).send('Curso no encontrado');
            console.log("Curso no encontrado");
        }

    } catch (err) {
        res.status(500).send({ "status": false, "message": "Error en el servidor" });
        console.log(err);
    }
}

var updateCodDocenteInCourseInstanceControllerFn = async (req, res) => {
    try {
        const codCurso = req.params.codCurso; // Código del curso
        const codDocente = req.params.codDocente; // Código del docente

        console.log("codCurso:", codCurso);
        console.log("codDocente:", codDocente);

        // Llama al servicio para actualizar codDocente
        const result = await courseInstanceService.updateCodDocenteInCourseInstance({codCurso: codCurso}, {codDocente: codDocente});

        if (result.status) {
            res.json(result); // Responde con el resultado del servicio
            console.log("codDocente actualizado");
        } else {
            res.status(404).send({ status: false, msg: "Curso no encontrado" });
            console.log("Curso no encontrado");
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: "Error en el servidor" });
        console.log("Error en el servidor:", err);
    }
};

var addStudentToCourseInstanceControllerFn = async (req, res) => {
    try {
        const codCurso = req.params.codCurso; 
        const matricula = req.params.matricula; 

        console.log("codCurso:", codCurso);
        console.log("alumno:", matricula);

        // Llama al servicio para actualizar codDocente
        const result = await courseInstanceService.addStudentToCourseInstanceDBService({codCurso: codCurso}, {alumno: matricula});

        if (result.status) {
            res.json(result); // Responde con el resultado del servicio
            console.log("Estudiante agregado");
        } else {
            res.status(404).send({ status: false, msg: "Curso no encontrado" });
            console.log("Curso no encontrado");
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: "Error en el servidor" });
        console.log("Error en el servidor:", err);
    }
};

var removeStudentFromCourseInstanceControllerFn = async (req, res) => {
    try {
        const codCurso = req.params.codCurso; 
        const matricula = req.params.matricula; 

        console.log("codCurso:", codCurso);
        console.log("alumno:", matricula);

        // Llama al servicio para actualizar codDocente
        const result = await courseInstanceService.removeStudentFromCourseInstanceDBService(codCurso,matricula);

        if (result.status) {
            res.json(result); // Responde con el resultado del servicio
            console.log("Estudiante eliminado");
        } else {
            res.status(404).send({ status: false, msg: "Estudiante no encontrado" });
            console.log("Estudiante no encontrado");
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: "Error en el servidor" });
        console.log("Error en el servidor:", err);
    }
};

var getTeacherCourseInstanceControllerFn = async (req, res) => {
    try {
        const rut = req.params.rut; 

        console.log("Rut:", rut);

        // Llama al servicio para actualizar codDocente
        const result = await courseInstanceService.getTeacherCourseInstancesDBService(rut);

        if (result.status) {
            res.json(result); // Responde con el resultado del servicio
            console.log("Curso encontrado");
        } else {
            res.status(404).send({ status: false, msg: "Profesor no encontrado" });
            console.log("Profesor no encontrado");
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: "Error en el servidor" });
        console.log("Error en el servidor:", err);
    }
};
module.exports = {registerCourseInstanceControllerFn, getCourseInstanceControllerFn, updateCodDocenteInCourseInstanceControllerFn, removeCourseInstanceControllerFn,
    getStudentsFromCourseInstanceControllerFn, getTeachingFromCourseInstanceControllerFn, addStudentToCourseInstanceControllerFn, getTeacherCourseInstanceControllerFn
    ,getAllCoursesInstanceControllerFn, removeStudentFromCourseInstanceControllerFn};
