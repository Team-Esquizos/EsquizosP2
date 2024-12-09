var learningService = require('./learningServices.js');

var getLearningsControllerFn = async (req, res) => {
    try {
        var result = await learningService.getLearningsDBService();


        if (result.status) {
            res.status(200).json(result.learnings);  
        } else {
            res.status(404).json({ message: result.msg }); 
        }

    } catch (err) {
        // Si ocurre un error en el servidor, respondemos con error 500
        res.status(500).send({ status: false, message: "Error en el servidor" });
        console.log(err);
    }
};

module.exports = {getLearningsControllerFn};
