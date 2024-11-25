var userModel = require('./userModel.js');

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