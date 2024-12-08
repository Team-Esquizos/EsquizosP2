var commentServices = require('./commentServices.js');

var addCommentControllerFn = async (req, res) => {
    try {

        var status = await commentServices.addCommentDBService(req.body);
        //console.log(status);

        if(status){
            res.send({"status": true, "message": "Comment added succesfully"});
        } else {
            res.send({"status": false, "message": "Failed adding a comment"});
        }

    } catch (err) {
        console.log(err);
    }
}

var removeCommentControllerFn = async (req, res) => {
    const _id = req.params._id; 

    try {
        const result = await commentServices.removeCommentDBService(_id);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error al eliminar el Comentario:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}

var getCommentsControllerFn = async (req, res) => {
    const instance = req.params; 

    try {
        const result = await commentServices.getCommentsDBService(instance);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}

var getCommentsByCourseControllerFn = async (req, res) => {
    const codCurso = req.params.codCurso; 
    const periodo = req.params.periodo; 

    try {
        const result = await commentServices.getCommentsByCourseDBService(codCurso, periodo);

        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ status: false, msg: "Error en el servidor" });
    }
}


module.exports = {addCommentControllerFn, removeCommentControllerFn, getCommentsControllerFn, getCommentsByCourseControllerFn};
