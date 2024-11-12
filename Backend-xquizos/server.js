const express = require('express');
const mongoose = require('./src/routes/mongooseConnection'); // Conexión a MongoDB
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const bodyParser = require('body-parser');


const cors = require('cors');
const routes = require('./route/routes');


mongoose.set('strictQuery', false);

const app = express();
const upload = multer({ dest: 'uploads/' }); // Configuración de multer

// Ruta raíz para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Ruta para subir el archivo CSV y guardar en MongoDB

app.post('/api/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.onFileChange(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Upload.insertMany(results); // Guarda en la colección 'upload'
        res.status(200).json({ message: 'Datos subidos correctamente' });
      } catch (error) {
        console.error("Error al guardar los datos:", error);
        res.status(500).json({ message: 'Error al guardar los datos' });
      } finally {
        fs.unlinkSync(filePath); // Elimina el archivo temporal
      }
    });
});

/*
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/users');
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB", err);
  }
}
connectToDatabase();
*/

app.use(cors({ origin: 'http://localhost:8080' })); 


app.use(express.json());
app.use(routes);

app.use(bodyParser.json());  // Middleware para procesar JSON
app.use(bodyParser.urlencoded({ extended: true }));  // Para datos de formularios

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
