var courseLearningModel = require('./courseLearningModel.js');
var learningModel = require('../learning/learningModel.js');

module.exports.getCourseLearningsDBService = async (curso) => {
    try {
        // Buscar en courseLearningModel por el código del curso
        const result = await courseLearningModel.find({ codCurso: curso });

        console.log("RESULTADO en courseLearningModel: ", result);

        if (result.length > 0) {
            // Extraer IDs o campo relevante para buscar en learningModel
            const learningIds = result.map((item) => item.aprendizaje); // Cambiar 'idLearning' según tu esquema

            // Buscar en learningModel con los IDs obtenidos
            const datos = await learningModel.find({ _id: { $in: learningIds } });

            console.log("Datos encontrados en learningModel: ", datos);

            return { status: true, msg: "Aprendizajes encontrados", courseLearnings: datos };
        } else {
            console.log("No se encontraron aprendizajes para el curso [", curso, "]");
            return { status: false, msg: "No se encontraron aprendizajes para el curso" };
        }
    } catch (error) {
        console.error("Error al obtener aprendizajes:", error);
        return { status: false, msg: "Error al obtener aprendizajes", error: error.message };
    }
};


module.exports.addLearningToCourseDBService = async (curso, ap) => {
    try {
        // Verificar si ya existe el aprendizaje para el curso
        const existingLearnings = await courseLearningModel.find({ codCurso: curso, aprendizaje: ap });

        if (existingLearnings.length > 0) {
            console.log(`El aprendizaje "${ap}" ya existe para el curso [${curso}]`);
            return { status: true, msg: "El aprendizaje ya existe", courseLearnings: existingLearnings };
        }

        // Si no existe, crear un nuevo registro
        const newLearning = new courseLearningModel({
            codCurso: curso,
            aprendizaje: ap
        });

        const savedLearning = await newLearning.save();

        console.log(`Nuevo aprendizaje agregado para el curso [${curso}]:`, ap);
        return { status: true, msg: "Aprendizaje agregado con éxito", courseLearning: savedLearning };

    } catch (error) {
        console.error("Error al agregar aprendizaje:", error);
        return { status: false, msg: "Error al agregar aprendizaje" };
    }
};

module.exports.removeLearningFromCourseDBService = async (curso, ap) => {
    try {
        // Verificar si el aprendizaje existe para el curso
        const existingLearning = await courseLearningModel.findOne({ codCurso: curso, aprendizaje: ap });

        if (!existingLearning) {
            console.log(`El aprendizaje "${ap}" no se encontró para el curso [${curso}]`);
            return { status: false, msg: "El aprendizaje no existe para el curso" };
        }

        // Eliminar el aprendizaje
        await courseLearningModel.deleteOne({ codCurso: curso, aprendizaje: ap });

        console.log(`El aprendizaje "${ap}" ha sido eliminado del curso [${curso}]`);
        return { status: true, msg: "Aprendizaje eliminado con éxito" };

    } catch (error) {
        console.error("Error al eliminar aprendizaje:", error);
        return { status: false, msg: "Error al eliminar aprendizaje" };
    }
};




