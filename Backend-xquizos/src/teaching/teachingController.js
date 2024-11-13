var teachingService = require('./teachingServices.js');

var registerTeachingControllerFn = async (req, res) => {
    try {

        var status = await teachingService.registerTeachingDBService(req.body);
        //console.log(status);

        if(status){
            res.send({"status": true, "message": "Teaching registered succesfully"});
        } else {
            res.send({"status": false, "message": "Failed teaching registration"});
        }

    } catch (err) {
        console.log(err);
    }
}

var getTeachingsControllerFn = async (req, res) => {
    try {

        var result = await teachingService.getTeachingsDBService();

     
        if (result.status) {
            res.status(200).json(result.teachings);  
        } else {
            res.status(404).json({ message: result.msg });  
        }

    } catch (err) {
        res.status(500).send({ status: false, message: "Error en el servidor" });
        console.log(err);
    }
};

var editTeachingControllerFn = async (req, res) => {
    const rut = req.params.rut; 
    const updatedData = req.body; 

    try {
        const result = await teachingService.editTeachingDBService(rut, updatedData);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error en la actualización del docente:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}

var removeTeachingControllerFn = async (req, res) => {
    const rut = req.params.rut; 

    try {
        const result = await teachingService.removeTeachingDBService(rut);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error al eliminar el docente:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}






var searchTeachingControllerFn = async (req, res) => {
    try {

        const nameSearch = req.params.nombrePrimer;
        
        var result = await teachingService.searchTeachingDBService( {name: nameSearch} );

        if(result.status){
            res.json(result.user);
            console.log("Docente encontrado");
        } else {
            res.status(404).send('Docente no encontrado');
            console.log("Docente no encontrado");
        }

    } catch (err) {
        res.status(500).send({ "status": false, "message": "Error en el servidor" });
        console.log(err);
    }
}

module.exports = {registerTeachingControllerFn, searchTeachingControllerFn, getTeachingsControllerFn, editTeachingControllerFn, removeTeachingControllerFn};
