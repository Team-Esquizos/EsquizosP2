var courseService = require('./courseServices.js');

var registerCourseControllerFn = async (req, res) => {
    try {

        var status = await courseService.registerCourseDBService(req.body);
        //console.log(status);

        if(status){
            res.send({"status": true, "message": "Course registered succesfully"});
        } else {
            res.send({"status": false, "message": "Failed course registration"});
        }

    } catch (err) {
        console.log(err);
    }
}

var getCoursesControllerFn = async (req, res) => {
    try {
        // Llamamos al servicio para obtener todos los estudiantes
        var result = await courseService.getCoursesDBService();

        // Si la consulta es exitosa y encontramos estudiantes
        if (result.status) {
            res.status(200).json(result.courses);  // Retornamos la lista de estudiantes
        } else {
            res.status(404).json({ message: result.msg });  // Retornamos mensaje si no hay estudiantes
        }

    } catch (err) {
        // Si ocurre un error en el servidor, respondemos con error 500
        res.status(500).send({ status: false, message: "Error en el servidor" });
        console.log(err);
    }
};

var editCourseControllerFn = async (req, res) => {
    const codigo = req.params.codigo; 
    const updatedData = req.body; 

    try {
        const result = await courseService.editCourseDBService(codigo, updatedData);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error en la actualización del curso:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}


var getCourseByEmailControllerFn = async (req, res) => {


    const email = req.params.email;
    console.log(email);
    try {
        console.log("entrando a db Services");
        const result = await courseService.getCoursesByEmailDBService(email);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error en la actualización del curso:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}





var removeCourseControllerFn = async (req, res) => {
    const nombreCurso = req.params.nombre; 
    const seccion = req.params.seccion;

    try {
        const result = await courseService.removeCourseDBService(nombreCurso, seccion);

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






var searchCourseControllerFn = async (req, res) => {
    try {

        const nombre = req.params.nombre;
        
        var result = await courseService.searchCourseDBService( {nombre: nombre} );

        if(result.status){
            res.json(result.user);
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

module.exports = {registerCourseControllerFn, searchCourseControllerFn, getCoursesControllerFn, editCourseControllerFn, removeCourseControllerFn, getCourseByEmailControllerFn};
