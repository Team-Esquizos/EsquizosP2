var commentModel = require('./commentModel.js');
var studentModel = require('../student/studentModel.js');


module.exports.addCommentDBService = (commentData) => {
    return new Promise(async function myFn(resolve, reject) {

        var commentModelData = new commentModel();

        var student = await studentModel.findOne({matricula: commentData.matricula});

        if (!student) {
            console.log("La matricula que se ingresó no pertenece a ningun estudiante!");
            return { status: false, msg: "matricula invalida" };
        } 


        commentModelData.matricula = commentData.matricula;
        commentModelData.codDocente = commentData.codDocente;
        commentModelData.comentario = commentData.comentario;
        commentModelData.peso = commentData.peso;
        commentModelData.flag = commentData.flag;


        try {
            await commentModelData.save();
            console.log("Nuevo comentario añadido", commentModelData);
            resolve(true);
        } catch (error) {
            console.log("El comentario no se pudo agregar con éxito");
            reject(error);
        }
    });
};




module.exports.removeCommentDBService = async (_id) => {
    try {
        const comment = await commentModel.findOne({ _id });

        if (comment) {
            await commentModel.deleteOne({ _id });

            console.log("Commentario eliminado:", comment);
            return { status: true, msg: "Comentario eliminado correctamente", comment };
        } else {
            console.log("Comentario no encontrado");
            return { status: false, msg: "Comentario no encontrado" };
        }
    } catch (error) {
        console.log("Error al eliminar el Comentario:", error);
        return { status: false, msg: "Error al eliminar el Comentario" };
    }
};



module.exports.getCommentsDBService = async (matricula) => {
    try {
        const comments = await commentModel.find({matricula: matricula});

        if (comments) {
            console.log("Comentarios del alumno ", matricula ,":", comments);
            return { status: true, msg: "Comentarios obtenidos correctamente", comments };
        } else {
            console.log("Comentarios no encontrados");
            return { status: false, msg: "Comentarios no encontrados" };
        }
    } catch (error) {
        console.log("Error al obtener Comentarios:", error);
        return { status: false, msg: "Error al obtener Comentarios" };
    }
};

module.exports.removeTeachingDBService = async (rut) => {
    try {
        const teaching = await teachingModel.findOne({ rut });

        if (teaching) {
            await teachingModel.deleteOne({ rut });

            console.log("Docente eliminado:", teaching);
            return { status: true, msg: "Docente eliminado correctamente", teaching };
        } else {
            console.log("Docente no encontrado");
            return { status: false, msg: "Docente no encontrado" };
        }
    } catch (error) {
        console.log("Error al eliminar el Docente:", error);
        return { status: false, msg: "Error al eliminar el Docente" };
    }
};


