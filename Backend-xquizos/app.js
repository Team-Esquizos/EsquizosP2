var mongoose = require('mongoose');
const uri = "mongodb+srv://Xpell:sebita2@cluster0.kzruh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const express = require('express');
const app = express();

var envioRutas = require('./src/routes/enviocsvroute');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect(uri);

app.use('/' ,envioRutas);


app.listen(8081, () => {
    console.log('Server is running on port 8081');
});

