var userModel = require('./userModel.js');
const fs = require('fs');

module.exports.registerUserDBService = (userData) => {
    return new Promise(async function myFn(resolve, reject) {

        var userModelData = new userModel();

        userModelData.email = userData.email;
        userModelData.username = userData.username;
        userModelData.password = userData.password;
        userModelData.isAdmin = userData.isAdmin;
        userModelData.rut = userData.rut;

        try {
            await userModelData.save();
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.loginUserDBService = async (userData) => {
    try {
        const result = await userModel.findOne({ email: userData.email });
        if (result) {
            if (result.password == userData.password) {
                console.log("VALIDATED");
                return { status: true, msg: "User Validated", username: result.username, isAdmin: result.isAdmin, rut: result.rut };
            } else {
                console.log("VALIDATION FAILED");
                return { status: false, msg: "User validation FAILED" };
            }
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "Invalid Data" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.buscarUserDBService = async (userData) => {
    try {
        const result = await userModel.findOne({ username: userData.username });

        if (result) {
            console.log("Usuario encontrado");
            return { status: true, msg: "Usuario encontrado", user: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.subirImagenDBService = async (username, imagen) => {
    try {
      const base64 = imagen.buffer.toString('base64');
      const users = await userModel.find({ username });
      console.log(users);
      console.log(username);
      if (users && users.length > 0) {
        for (let user of users) {
          user.imagen = base64;
          await user.save();
        }
        return { status: true, msg: "Imagen subida", users };
      } else {
        console.log("No se encontraron usuarios");
        return { status: false, msg: "No se encontraron usuarios" };
      }
    } catch (error) {
      console.log("Error al subir la imagen:", error);
      return { status: false, msg: "Error al subir la imagen" };
    }
  };

  module.exports.obtenerImagenDBService = async (username) => {
    try {
        const user = await userModel.findOne({ username });
        
        if (user && user.imagen) {
            return { status: true, imagen: user.imagen };
        } else {
            return { status: false, msg: 'Imagen no encontrada' };
        }
    } catch (error) {
        console.log('Error al obtener la imagen:', error);
        return { status: false, msg: 'Error al obtener la imagen' };
    }
};