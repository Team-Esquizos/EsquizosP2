var courseInstanceService = require('./courseInstanceServices.js');

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

module.exports = {registerCourseInstanceControllerFn, getCourseInstanceControllerFn, editCourseControllerFn, removeCourseControllerFn,
    getStudentsFromCourseInstanceControllerFn, getTeachingFromCourseInstanceControllerFn};
