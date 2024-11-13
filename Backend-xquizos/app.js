var mongoose = require('mongoose');

// Conexión a la base de datos
const uri = "mongodb+srv://Xpell:sebita2@cluster0.kzruh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const express = require('express');
const app = express();

var envioRutas = require('./src/routes/enviocsvroute');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect(uri);

// Conexión al envio de rutas
app.use('/' ,envioRutas);



// Escuchando el puerto 8081
app.listen(3333, () => {
    console.log('Server is running on port 8081');
});

