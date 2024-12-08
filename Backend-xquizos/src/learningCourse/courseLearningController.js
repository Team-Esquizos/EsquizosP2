var courseLearningService = require('./courseLearningServices.js');

var getCourseLearningsControllerFn = async (req, res) => {
    try {

        const curso = req.params.codCurso;

        var result = await courseLearningService.getCourseLearningsDBService(curso);


        if (result.status) {
            res.status(200).json(result.courseLearnings);  
        } else {
            res.status(404).json({ message: result.msg }); 
        }

    } catch (err) {
        // Si ocurre un error en el servidor, respondemos con error 500
        res.status(500).send({ status: false, message: "Error en el servidor" });
        console.log(err);
    }
};

var addLearningToCourseControllerFn = async (req, res) => {
    try {

        const curso = req.params.codCurso;
        const ap = req.params._id;

        var result = await courseLearningService.addLearningToCourseDBService(curso, ap);


        if(result){
            res.send({"status": true, "message": "Course Learning registered succesfully"});
        } else {
            res.send({"status": false, "message": "Failed Course Learning registration"});
        }

    } catch (err) {
        // Si ocurre un error en el servidor, respondemos con error 500
        res.status(500).send({ status: false, message: "Error en el servidor" });
        console.log(err);
    }
};

var removeLearningFromCourseControllerFn = async (req, res) => {
    try {

        const curso = req.params.codCurso;
        const ap = req.params._id;

        var result = await courseLearningService.removeLearningFromCourseDBService(curso, ap);


        if(result){
            res.send({"status": true, "message": "Course Learning removed succesfully"});
        } else {
            res.send({"status": false, "message": "Failed Course Learning removing"});
        }

    } catch (err) {
        // Si ocurre un error en el servidor, respondemos con error 500
        res.status(500).send({ status: false, message: "Error en el servidor" });
        console.log(err);
    }
};

module.exports = {getCourseLearningsControllerFn, addLearningToCourseControllerFn, removeLearningFromCourseControllerFn};
