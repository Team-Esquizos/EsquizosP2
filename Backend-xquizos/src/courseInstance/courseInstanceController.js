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

        const curso = req.params;
        
        console.log(curso);
        
        var result = await courseInstanceService.getStudentsFromCourseInstanceDBService(curso);

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

        const curso = req.params;
        console.log("CURSO DONDE BUSCAR EL TEACHER: ",curso);
        
        var result = await courseInstanceService.getTeachingFromCourseInstanceDBService(curso);

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
        const curso = req.params

        console.log("codCurso:", curso.codCurso);
        console.log("NEWcodDocente:", curso.codDocente);
        console.log("periodo:", curso.periodo);

        // Llama al servicio para actualizar codDocente
        const result = await courseInstanceService.updateCodDocenteInCourseInstance(curso);

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
        const data = req.params; 


        console.log("codCurso:", data.codCurso);
        console.log("periodo:", data.periodo);
        console.log("alumno:", data.matricula);

        // Llama al servicio para actualizar codDocente
        const result = await courseInstanceService.addStudentToCourseInstanceDBService(data);

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
        const periodo = req.params.periodo; 

        console.log("Rut:", rut);
        console.log("Periodo:", periodo);

        const result = await courseInstanceService.getTeacherCourseInstancesDBService(rut, periodo);

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
