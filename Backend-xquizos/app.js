var mongoose = require('mongoose');
const cors = require('cors');  // Importa el paquete CORS
const router = require('./route/routes');
const envioRutas = require('./src/routes/enviocsvroute');

// Conexión a la base de datos
const uri = "mongodb+srv://Xpell:sebita2@cluster0.kzruh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const express = require('express');
const app = express();

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch((err) => {
        console.log('Error de conexión a MongoDB:', err);
    });

// Middleware para CORS
app.use(cors({ origin: 'http://localhost:8080' })); // Cambia el puerto si es necesario

// Configuración de JSON 
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas
app.use('/api', router);  // Rutas de './route/routes'
app.use('/csv', envioRutas);  // Rutas de './src/routes/enviocsvroute'

// Escuchando el puerto 3333
app.listen(3333, () => {
    console.log('Server is running on port 3333');
});
