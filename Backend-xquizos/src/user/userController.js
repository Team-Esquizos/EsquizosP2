var userService = require('./userServices.js');

var registerUserControllerFn = async (req, res) => {
    try {

        var status = await userService.registerUserDBService(req.body);
        //console.log(status);

        if(status){
            res.send({"status": true, "message": "User registered succesfully"});
        } else {
            res.send({"status": false, "message": "Failed user registration"});
        }

    } catch (err) {
        console.log(err);
    }
}

var loginUserControllerFn = async (req, res) => {

    var result = null;

    try {

        result = await userService.loginUserDBService(req.body);

        if(result.status){
            res.send({"status": true, "message": result.msg, "username": result.username, "isAdmin": result.isAdmin, "rut": result.rut});
            console.log("primer if");
        } else {
            res.send({"status": false, "message": result.msg});
            console.log("primer if - else");
        }

    } catch (error) {
        console.log(error);
        res.send({"status": false, "message": result.msg});
    }
}

var buscarUserControllerFn = async (req, res) => {
    try {

        const usernameBuscar = req.params.username;
        
        var result = await userService.buscarUserDBService( {username: usernameBuscar} );
        //console.log(result.status);

        if(result.status){
            res.json(result.user);
            console.log("Usuario encontrado");
        } else {
            res.status(404).send('Usuario no encontrado');
            console.log("Usuario no encontrado");
        }

    } catch (err) {
        res.status(500).send({ "status": false, "message": "Error en el servidor" });
        console.log(err);
    }
}

module.exports = {registerUserControllerFn, loginUserControllerFn, buscarUserControllerFn};
