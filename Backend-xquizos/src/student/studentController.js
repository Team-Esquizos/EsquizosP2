var studentService = require('./studentServices.js');

var registerStudentControllerFn = async (req, res) => {
    try {

        var status = await studentService.registerStudentDBService(req.body);
        //console.log(status);

        if(status){
            res.send({"status": true, "message": "Student registered succesfully"});
        } else {
            res.send({"status": false, "message": "Failed student registration"});
        }

    } catch (err) {
        console.log(err);
    }
}

var getStudentsControllerFn = async (req, res) => {
    try {
        // Llamamos al servicio para obtener todos los estudiantes
        var result = await studentService.getStudentsDBService();

        // Si la consulta es exitosa y encontramos estudiantes
        if (result.status) {
            res.status(200).json(result.students);  // Retornamos la lista de estudiantes
        } else {
            res.status(404).json({ message: result.msg });  // Retornamos mensaje si no hay estudiantes
        }

    } catch (err) {
        // Si ocurre un error en el servidor, respondemos con error 500
        res.status(500).send({ status: false, message: "Error en el servidor" });
        console.log(err);
    }
};

var editStudentControllerFn = async (req, res) => {
    const matricula = req.params.matricula; 
    const updatedData = req.body; 

    try {
        const result = await studentService.editStudentDBService(matricula, updatedData);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error en la actualización del estudiante:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}

var removeStudentControllerFn = async (req, res) => {
    const matricula = req.params.matricula; 

    try {
        const result = await studentService.removeStudentDBService(matricula);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}


var addlista_de_accionesControllerFn = async (req, res) => {
    const matricula = req.params.matricula; 
    const accion = req.body.lista_de_acciones;

    try {
        const result = await studentService.addlista_de_accionesDBService(matricula, accion);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error en la actualización del estudiante:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }

}



var searchStudentControllerFn = async (req, res) => {
    try {

        const usernameBuscar = req.params.username;
        
        var result = await studentService.searchStudentDBService( {username: usernameBuscar} );

        if(result.status){
            res.json(result.user);
            console.log("Estudiante encontrado");
        } else {
            res.status(404).send('Estudiante no encontrado');
            console.log("Estudiante no encontrado");
        }

    } catch (err) {
        res.status(500).send({ "status": false, "message": "Error en el servidor" });
        console.log(err);
    }
}

var getCourseByNomControllerFn = async (req, res) => {
    const nombre = req.params.nombre; 
    const seccion = req.params.seccion;

    try {
        const result = await studentService.getCourseByNomDBService(nombre, seccion);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error en la busqueda del curso:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}

module.exports = {registerStudentControllerFn, searchStudentControllerFn, getStudentsControllerFn, editStudentControllerFn, removeStudentControllerFn, getCourseByNomControllerFn, addlista_de_accionesControllerFn};
