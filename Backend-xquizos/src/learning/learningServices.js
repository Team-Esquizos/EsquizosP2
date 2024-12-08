var learningModel = require('./learningModel.js');



module.exports.getLearningsDBService = async () => {
    try {
        const result = await learningModel.find();

        if (result.length > 0) {
            console.log("Aprendizajes encontrados");
            return { status: true, msg: "Aprendizajes encontrados", learnings: result };
        } else {
            console.log("No se encontraron Aprendizajes");
            return { status: false, msg: "No se encontraron Aprendizajes" };
        }

    } catch (error) {
        console.log("Error al obtener Aprendizajes:", error);
        return { status: false, msg: "Error al obtener Aprendizajes" };
    }
};


